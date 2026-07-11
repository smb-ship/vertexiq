from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone

db = SQLAlchemy()


class RevenuePoint(db.Model):
    __tablename__ = "revenue_points"

    id = db.Column(db.Integer, primary_key=True)
    month = db.Column(db.String(10), nullable=False)
    revenue = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {"id": self.id, "month": self.month, "revenue": self.revenue}


class TrafficSource(db.Model):
    __tablename__ = "traffic_sources"

    id = db.Column(db.Integer, primary_key=True)
    source = db.Column(db.String(50), nullable=False)
    visits = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {"source": self.source, "visits": self.visits}


class TeamMember(db.Model):
    __tablename__ = "team_members"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(20), nullable=False)
    avatar_initial = db.Column(db.String(1), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "status": self.status,
            "avatarInitial": self.avatar_initial,
        }


class Notification(db.Model):
    __tablename__ = "notifications"

    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.String(300), nullable=False)
    unread = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "message": self.message,
            "unread": self.unread,
            "time": self.created_at.isoformat(),
        }


class Kpi(db.Model):
    __tablename__ = "kpis"

    id = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.String(100), nullable=False)
    value = db.Column(db.String(50), nullable=False)
    change = db.Column(db.Float, nullable=False)
    icon = db.Column(db.String(50), nullable=False)
    trend = db.Column(db.String(200), nullable=False)  # comma-separated numbers

    def to_dict(self):
        return {
            "id": self.id,
            "label": self.label,
            "value": self.value,
            "change": self.change,
            "icon": self.icon,
            "trend": [int(x) for x in self.trend.split(",")],
       }

import bcrypt


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), nullable=False, default="Analyst")

    def set_password(self, password: str):
        self.password_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    def check_password(self, password: str) -> bool:
        return bcrypt.checkpw(password.encode("utf-8"), self.password_hash.encode("utf-8"))

    def to_dict(self):
        return {"id": self.id, "name": self.name, "email": self.email, "role": self.role}