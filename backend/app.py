import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
from dotenv import load_dotenv
from models import db, RevenuePoint, TrafficSource, TeamMember, Notification, Kpi
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt
from models import db, RevenuePoint, TrafficSource, TeamMember, Notification, Kpi, User


load_dotenv()

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///vertexiq.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "dev-secret-change-in-production")
jwt = JWTManager(app)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/api/ai/summary", methods=["POST"])
def ai_summary():
    data = request.get_json()
    kpis = data.get("kpis", [])

    kpi_text = "\n".join(
        f"- {kpi['label']}: {kpi['value']} ({kpi['change']}% vs last month)"
        for kpi in kpis
    )

    prompt = f"""You are a business analyst. Based on these KPIs, write a concise 2-3 sentence executive summary highlighting the most important trend and one thing to watch:

{kpi_text}

Keep it under 60 words. Be direct and specific, not generic."""

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=150,
    )

    summary = completion.choices[0].message.content

    return jsonify({"summary": summary})

import json

@app.route("/api/ai/recommendations", methods=["POST"])
def ai_recommendations():
    data = request.get_json()
    kpis = data.get("kpis", [])

    kpi_text = "\n".join(
        f"- {kpi['label']}: {kpi['value']} ({kpi['change']}% vs last month)"
        for kpi in kpis
    )

    prompt = f"""You are a business analyst. Based on these KPIs, write exactly 3 short, actionable recommendations for the business:

{kpi_text}

Respond ONLY with a JSON array of 3 strings, nothing else. No markdown, no preamble. Example format:
["First recommendation.", "Second recommendation.", "Third recommendation."]"""

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=300,
    )

    raw = completion.choices[0].message.content.strip()

    try:
        recommendations = json.loads(raw)
    except json.JSONDecodeError:
        recommendations = [raw]

    return jsonify({"recommendations": recommendations})

@app.route("/api/ai/trends", methods=["GET"])
@jwt_required()
def ai_trends():
    revenue_points = RevenuePoint.query.all()
    revenue_text = "\n".join(f"- {p.month}: ${p.revenue}" for p in revenue_points)

    prompt = f"""You are a business analyst. Analyze this revenue trend data and identify the single most significant trend:

{revenue_text}

Respond ONLY with a JSON object with these exact keys: "trend" (one short sentence describing the trend), "direction" ("up", "down", or "flat"), "confidence" ("high", "medium", or "low"). No markdown, no preamble."""

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=150,
    )

    raw = completion.choices[0].message.content.strip()
    try:
        result = json.loads(raw)
    except json.JSONDecodeError:
        result = {"trend": raw, "direction": "flat", "confidence": "low"}

    return jsonify(result)


@app.route("/api/ai/anomalies", methods=["GET"])
@jwt_required()
def ai_anomalies():
    revenue_points = RevenuePoint.query.all()
    kpis = Kpi.query.all()

    data_text = "Revenue by month:\n" + "\n".join(f"- {p.month}: ${p.revenue}" for p in revenue_points)
    data_text += "\n\nKPIs:\n" + "\n".join(f"- {k.label}: {k.value} ({k.change}% change)" for k in kpis)

    prompt = f"""You are a business analyst looking for anomalies or unusual patterns in this data:

{data_text}

Respond ONLY with a JSON array of up to 3 anomalies, each an object with keys "title" (short label) and "description" (one sentence explaining what's unusual and why it matters). If nothing unusual stands out, return an empty array. No markdown, no preamble."""

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=400,
    )

    raw = completion.choices[0].message.content.strip()
    try:
        result = json.loads(raw)
    except json.JSONDecodeError:
        result = []

    return jsonify({"anomalies": result})

@app.route("/api/ai/ask", methods=["POST"])
@jwt_required()
def ai_ask():
    data = request.get_json()
    question = data.get("question", "").strip()

    if not question:
        return jsonify({"error": "Question is required"}), 400

    revenue_points = RevenuePoint.query.all()
    traffic_sources = TrafficSource.query.all()
    team_members = TeamMember.query.all()
    kpis = Kpi.query.all()

    context = "Revenue by month:\n" + "\n".join(f"- {p.month}: ${p.revenue}" for p in revenue_points)
    context += "\n\nTraffic by source:\n" + "\n".join(f"- {t.source}: {t.visits} visits" for t in traffic_sources)
    context += "\n\nKPIs:\n" + "\n".join(f"- {k.label}: {k.value} ({k.change}% change)" for k in kpis)
    context += "\n\nTeam:\n" + "\n".join(f"- {m.name} ({m.role}, {m.status})" for m in team_members)

    prompt = f"""You are VertexIQ's AI assistant, embedded in a business intelligence dashboard. Answer the user's question using ONLY the data below. Be concise (under 60 words) and specific — cite real numbers from the data. If the question can't be answered from this data, say so directly.

DASHBOARD DATA:
{context}

QUESTION: {question}"""

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=200,
    )

    answer = completion.choices[0].message.content

    return jsonify({"answer": answer})

@app.route("/api/ai/report", methods=["GET"])
@jwt_required()
def ai_executive_report():
    revenue_points = RevenuePoint.query.all()
    traffic_sources = TrafficSource.query.all()
    kpis = Kpi.query.all()
    team_members = TeamMember.query.all()

    context = "Revenue by month:\n" + "\n".join(f"- {p.month}: ${p.revenue}" for p in revenue_points)
    context += "\n\nTraffic by source:\n" + "\n".join(f"- {t.source}: {t.visits} visits" for t in traffic_sources)
    context += "\n\nKPIs:\n" + "\n".join(f"- {k.label}: {k.value} ({k.change}% change)" for k in kpis)
    context += f"\n\nTeam size: {len(team_members)} members"

    prompt = f"""You are writing a brief executive report for a business dashboard. Using the data below, write a 3-paragraph report covering: (1) overall performance summary, (2) key strengths, (3) areas needing attention. Keep each paragraph to 2-3 sentences. Be specific and cite real numbers.

{context}"""

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=500,
    )

    return jsonify({"report": completion.choices[0].message.content})


@app.route("/api/ai/forecast", methods=["GET"])
@jwt_required()
def ai_forecast():
    revenue_points = RevenuePoint.query.all()
    revenue_text = "\n".join(f"- {p.month}: ${p.revenue}" for p in revenue_points)

    prompt = f"""You are a business analyst. Based on this revenue history, forecast the next 3 months.

{revenue_text}

Respond ONLY with a JSON array of exactly 3 objects, each with keys "month" (short label like "Aug") and "projected_revenue" (integer, no dollar sign). Base your forecast on the trend in the data. No markdown, no preamble."""

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=200,
    )

    raw = completion.choices[0].message.content.strip()
    try:
        forecast = json.loads(raw)
    except json.JSONDecodeError:
        forecast = []

    return jsonify({"forecast": forecast})

@app.route("/api/dashboard/revenue", methods=["GET"])
def dashboard_revenue():
    points = RevenuePoint.query.all()
    return jsonify([p.to_dict() for p in points])

@app.route("/api/dashboard/revenue", methods=["POST"])
@jwt_required()
def create_revenue_point():
    claims = get_jwt()
    if claims.get("role") != "Admin":
        return jsonify({"error": "Only Admins can add revenue records"}), 403

    data = request.get_json()
    month = data.get("month")
    revenue = data.get("revenue")

    if not month or revenue is None:
        return jsonify({"error": "Month and revenue are required"}), 400

    point = RevenuePoint(month=month, revenue=int(revenue))
    db.session.add(point)
    db.session.commit()
    return jsonify(point.to_dict()), 201


@app.route("/api/dashboard/revenue/<int:point_id>", methods=["PUT"])
@jwt_required()
def update_revenue_point(point_id):
    claims = get_jwt()
    if claims.get("role") != "Admin":
        return jsonify({"error": "Only Admins can edit revenue records"}), 403

    point = RevenuePoint.query.get(point_id)
    if not point:
        return jsonify({"error": "Revenue record not found"}), 404

    data = request.get_json()
    if "month" in data:
        point.month = data["month"]
    if "revenue" in data:
        point.revenue = int(data["revenue"])

    db.session.commit()
    return jsonify(point.to_dict())


@app.route("/api/dashboard/revenue/<int:point_id>", methods=["DELETE"])
@jwt_required()
def delete_revenue_point(point_id):
    claims = get_jwt()
    if claims.get("role") != "Admin":
        return jsonify({"error": "Only Admins can delete revenue records"}), 403

    point = RevenuePoint.query.get(point_id)
    if not point:
        return jsonify({"error": "Revenue record not found"}), 404

    db.session.delete(point)
    db.session.commit()
    return jsonify({"message": "Revenue record deleted"}), 200

@app.route("/api/analytics/traffic", methods=["GET"])
def analytics_traffic():
    sources = TrafficSource.query.all()
    return jsonify([s.to_dict() for s in sources])


@app.route("/api/team", methods=["GET"])
@jwt_required()
def team_members():
    members = TeamMember.query.all()
    return jsonify([m.to_dict() for m in members])

@app.route("/api/team", methods=["POST"])
@jwt_required()
def create_team_member():
    claims = get_jwt()
    if claims.get("role") != "Admin":
        return jsonify({"error": "Only Admins can add team members"}), 403

    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    role = data.get("role")
    status = data.get("status", "Active")

    if not all([name, email, role]):
        return jsonify({"error": "Name, email, and role are required"}), 400

    if role not in ["Admin", "Manager", "Analyst"]:
        return jsonify({"error": "Invalid role"}), 400

    if status not in ["Active", "Away", "Offline"]:
        return jsonify({"error": "Invalid status"}), 400

    member = TeamMember(
        name=name,
        email=email,
        role=role,
        status=status,
        avatar_initial=name[0].upper(),
    )
    db.session.add(member)
    db.session.commit()

    return jsonify(member.to_dict()), 201


@app.route("/api/team/<int:member_id>", methods=["PUT"])
@jwt_required()
def update_team_member(member_id):
    claims = get_jwt()
    if claims.get("role") != "Admin":
        return jsonify({"error": "Only Admins can edit team members"}), 403

    member = TeamMember.query.get(member_id)
    if not member:
        return jsonify({"error": "Team member not found"}), 404

    data = request.get_json()

    if "name" in data:
        member.name = data["name"]
        member.avatar_initial = data["name"][0].upper()
    if "email" in data:
        member.email = data["email"]
    if "role" in data:
        if data["role"] not in ["Admin", "Manager", "Analyst"]:
            return jsonify({"error": "Invalid role"}), 400
        member.role = data["role"]
    if "status" in data:
        if data["status"] not in ["Active", "Away", "Offline"]:
            return jsonify({"error": "Invalid status"}), 400
        member.status = data["status"]

    db.session.commit()
    return jsonify(member.to_dict())


@app.route("/api/team/<int:member_id>", methods=["DELETE"])
@jwt_required()
def delete_team_member(member_id):
    claims = get_jwt()
    if claims.get("role") != "Admin":
        return jsonify({"error": "Only Admins can remove team members"}), 403

    member = TeamMember.query.get(member_id)
    if not member:
        return jsonify({"error": "Team member not found"}), 404

    db.session.delete(member)
    db.session.commit()
    return jsonify({"message": "Team member deleted"}), 200


@app.route("/api/notifications", methods=["POST"])
@jwt_required()
def create_notification():
    claims = get_jwt()
    if claims.get("role") != "Admin":
        return jsonify({"error": "Only Admins can create notifications"}), 403

    data = request.get_json()
    message = data.get("message")
    if not message:
        return jsonify({"error": "Message is required"}), 400

    notification = Notification(message=message, unread=True)
    db.session.add(notification)
    db.session.commit()
    return jsonify(notification.to_dict()), 201


@app.route("/api/notifications", methods=["GET"])
@jwt_required()
def get_notifications():
    notifications = Notification.query.order_by(Notification.created_at.desc()).all()
    return jsonify([n.to_dict() for n in notifications])

    data = request.get_json()
    if "unread" in data:
        notification.unread = data["unread"]

    db.session.commit()
    return jsonify(notification.to_dict())


@app.route("/api/notifications/mark-all-read", methods=["PUT"])
@jwt_required()
def mark_all_notifications_read():
    Notification.query.update({Notification.unread: False})
    db.session.commit()
    return jsonify({"message": "All notifications marked read"})


@app.route("/api/notifications/<int:notif_id>", methods=["DELETE"])
@jwt_required()
def delete_notification(notif_id):
    claims = get_jwt()
    if claims.get("role") != "Admin":
        return jsonify({"error": "Only Admins can delete notifications"}), 403

    notification = Notification.query.get(notif_id)
    if not notification:
        return jsonify({"error": "Notification not found"}), 404

    db.session.delete(notification)
    db.session.commit()
    return jsonify({"message": "Notification deleted"}), 200

@app.route("/api/kpis", methods=["GET"])
@jwt_required()
def get_kpis():
    claims = get_jwt()
    if claims.get("role") not in ["Admin", "Manager", "Analyst"]:
        return jsonify({"error": "Insufficient permissions"}), 403

    kpis = Kpi.query.all()
    return jsonify([k.to_dict() for k in kpis])

@app.route("/api/kpis", methods=["POST"])
@jwt_required()
def create_kpi():
    claims = get_jwt()
    if claims.get("role") != "Admin":
        return jsonify({"error": "Only Admins can add KPIs"}), 403

    data = request.get_json()
    label = data.get("label")
    value = data.get("value")
    change = data.get("change")
    icon = data.get("icon", "Activity")
    trend = data.get("trend", [50, 50, 50, 50, 50, 50, 50])

    if not all([label, value]) or change is None:
        return jsonify({"error": "Label, value, and change are required"}), 400

    kpi = Kpi(label=label, value=value, change=float(change), icon=icon, trend=",".join(str(int(t)) for t in trend))
    db.session.add(kpi)
    db.session.commit()
    return jsonify(kpi.to_dict()), 201


@app.route("/api/kpis/<int:kpi_id>", methods=["PUT"])
@jwt_required()
def update_kpi(kpi_id):
    claims = get_jwt()
    if claims.get("role") != "Admin":
        return jsonify({"error": "Only Admins can edit KPIs"}), 403

    kpi = Kpi.query.get(kpi_id)
    if not kpi:
        return jsonify({"error": "KPI not found"}), 404

    data = request.get_json()
    if "label" in data:
        kpi.label = data["label"]
    if "value" in data:
        kpi.value = data["value"]
    if "change" in data:
        kpi.change = float(data["change"])
    if "icon" in data:
        kpi.icon = data["icon"]

    db.session.commit()
    return jsonify(kpi.to_dict())


@app.route("/api/kpis/<int:kpi_id>", methods=["DELETE"])
@jwt_required()
def delete_kpi(kpi_id):
    claims = get_jwt()
    if claims.get("role") != "Admin":
        return jsonify({"error": "Only Admins can delete KPIs"}), 403

    kpi = Kpi.query.get(kpi_id)
    if not kpi:
        return jsonify({"error": "KPI not found"}), 404

    db.session.delete(kpi)
    db.session.commit()
    return jsonify({"message": "KPI deleted"}), 200

@app.route("/api/auth/register", methods=["POST"])
def register():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "Analyst")

    if not all([name, email, password]):
        return jsonify({"error": "Name, email, and password are required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 409

    user = User(name=name, email=email, role=role)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User created", "user": user.to_dict()}), 201


@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password"}), 401

    access_token = create_access_token(
    identity=str(user.id),
    additional_claims={"role": user.role, "name": user.name, "email": user.email},
)

    return jsonify({"access_token": access_token, "user": user.to_dict()})


@app.route("/api/auth/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user.to_dict())

if __name__ == "__main__":
    app.run(debug=True, port=5000)