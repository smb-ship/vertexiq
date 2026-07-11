from app import app
from models import db, RevenuePoint, TrafficSource, TeamMember, Notification, Kpi
from models import db, RevenuePoint, TrafficSource, TeamMember, Notification, Kpi, User

with app.app_context():
    db.drop_all()
    db.create_all()

    revenue_data = [
        ("Jan", 4200), ("Feb", 5100), ("Mar", 4800), ("Apr", 6300),
        ("May", 7100), ("Jun", 6900), ("Jul", 8200),
    ]
    for month, revenue in revenue_data:
        db.session.add(RevenuePoint(month=month, revenue=revenue))

    traffic_data = [
        ("Direct", 3200), ("Organic", 4800), ("Social", 2100),
        ("Referral", 1600), ("Email", 950),
    ]
    for source, visits in traffic_data:
        db.session.add(TrafficSource(source=source, visits=visits))

    team_data = [
        ("Mal", "mal@vertexiq.com", "Admin", "Active", "M"),
        ("Sara Khan", "sara@vertexiq.com", "Manager", "Active", "S"),
        ("James Wu", "james@vertexiq.com", "Analyst", "Away", "J"),
        ("Priya Patel", "priya@vertexiq.com", "Analyst", "Offline", "P"),
        ("Tom Reyes", "tom@vertexiq.com", "Manager", "Active", "T"),
    ]
    for name, email, role, status, initial in team_data:
        db.session.add(TeamMember(name=name, email=email, role=role, status=status, avatar_initial=initial))

    notifications_data = [
        ("Revenue report for June is ready to view.", True),
        ("New user signup spike detected — 42 today.", True),
        ("Weekly AI summary has been generated.", False),
    ]
    for message, unread in notifications_data:
        db.session.add(Notification(message=message, unread=unread))

    kpi_data = [
        ("Total Revenue", "$48,200", 12.4, "DollarSign", "30,42,38,55,48,62,71"),
        ("Active Users", "3,214", 8.1, "Users", "40,38,45,42,50,55,58"),
        ("New Orders", "1,082", -3.2, "ShoppingCart", "55,50,52,48,45,42,40"),
        ("Engagement Rate", "76%", 5.6, "Activity", "35,40,38,45,48,52,56"),
    ]
    for label, value, change, icon, trend in kpi_data:
        db.session.add(Kpi(label=label, value=value, change=change, icon=icon, trend=trend))

    admin = User(name="Mal", email="mal@vertexiq.com", role="Admin")
    admin.set_password("VertexIQ2026!")
    db.session.add(admin)

    db.session.commit()
    print("Database seeded successfully.")