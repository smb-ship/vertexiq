import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

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
@app.route("/api/dashboard/revenue", methods=["GET"])
def dashboard_revenue():
    data = [
        {"month": "Jan", "revenue": 4200},
        {"month": "Feb", "revenue": 5100},
        {"month": "Mar", "revenue": 4800},
        {"month": "Apr", "revenue": 6300},
        {"month": "May", "revenue": 7100},
        {"month": "Jun", "revenue": 6900},
        {"month": "Jul", "revenue": 8200},
    ]
    return jsonify(data)


@app.route("/api/analytics/traffic", methods=["GET"])
def analytics_traffic():
    data = [
        {"source": "Direct", "visits": 3200},
        {"source": "Organic", "visits": 4800},
        {"source": "Social", "visits": 2100},
        {"source": "Referral", "visits": 1600},
        {"source": "Email", "visits": 950},
    ]
    return jsonify(data)


@app.route("/api/team", methods=["GET"])
def team_members():
    data = [
        {"id": 1, "name": "Mal", "email": "mal@vertexiq.com", "role": "Admin", "status": "Active", "avatarInitial": "M"},
        {"id": 2, "name": "Sara Khan", "email": "sara@vertexiq.com", "role": "Manager", "status": "Active", "avatarInitial": "S"},
        {"id": 3, "name": "James Wu", "email": "james@vertexiq.com", "role": "Analyst", "status": "Away", "avatarInitial": "J"},
        {"id": 4, "name": "Priya Patel", "email": "priya@vertexiq.com", "role": "Analyst", "status": "Offline", "avatarInitial": "P"},
        {"id": 5, "name": "Tom Reyes", "email": "tom@vertexiq.com", "role": "Manager", "status": "Active", "avatarInitial": "T"},
    ]
    return jsonify(data)
    
if __name__ == "__main__":
    app.run(debug=True, port=5000)