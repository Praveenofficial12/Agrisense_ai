import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# ─── Load .env file if it exists ─────────────────────────────────────────────
try:
    from dotenv import load_dotenv
    load_dotenv(override=True)
    print("[Config] Loaded .env file")
except ImportError:
    pass  # python-dotenv not installed, use env vars only

# ─── SMTP Configuration ──────────────────────────────────────────────────────
# Option A: Set environment variables (recommended for production)
# Option B: Edit the values directly below for quick testing
SMTP_HOST    = os.getenv("SMTP_HOST",    "smtp.gmail.com")
SMTP_PORT    = int(os.getenv("SMTP_PORT","587"))
SMTP_USER    = os.getenv("SMTP_USER",    "")   # your.email@gmail.com
SMTP_PASS    = os.getenv("SMTP_PASS",    "")   # 16-char Gmail App Password
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

EMAIL_CONFIGURED = bool(SMTP_USER and SMTP_PASS)

if EMAIL_CONFIGURED:
    print(f"[Email] ✅  SMTP configured — will send real emails from {SMTP_USER}")
else:
    print("[Email] ⚠️  SMTP not configured — reset links will be printed to console only")
    print("[Email]    → Set SMTP_USER + SMTP_PASS in backend/.env to enable real email")


def send_email(to_email: str, subject: str, html_body: str) -> bool:
    """Send an HTML email. Returns True on success."""
    if not EMAIL_CONFIGURED:
        print(f"\n{'='*60}")
        print(f"[RESET EMAIL — CONSOLE FALLBACK]")
        print(f"To:      {to_email}")
        print(f"Subject: {subject}")
        print(f"{'='*60}\n")
        return False
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"]    = f"AgriSense AI <{SMTP_USER}>"
        msg["To"]      = to_email
        msg.attach(MIMEText(html_body, "html"))
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=15) as server:
            server.ehlo()
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.sendmail(SMTP_USER, to_email, msg.as_string())
        print(f"[Email] ✅  Sent to {to_email}")
        return True
    except smtplib.SMTPAuthenticationError:
        print("[Email] ❌  Authentication failed — check SMTP_USER and SMTP_PASS")
        return False
    except smtplib.SMTPException as e:
        print(f"[Email] ❌  SMTP error: {e}")
        return False
    except Exception as e:
        print(f"[Email] ❌  Unexpected error: {e}")
        return False


def build_reset_email(username: str, reset_url: str) -> str:
    return f"""<!DOCTYPE html><html>
<head><meta charset="UTF-8"><title>Reset Password</title></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#f0fdf4;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
  <tr><td align="center">
    <table width="540" cellpadding="0" cellspacing="0" style="background:white;border-radius:20px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.08);">

      <tr><td style="background:linear-gradient(135deg,#1b5e20,#2E7D32,#43a047);padding:40px;text-align:center;">
        <div style="font-size:40px;margin-bottom:12px;">🌿</div>
        <h1 style="color:white;margin:0;font-size:28px;font-weight:800;letter-spacing:-0.5px;">AgriSense AI</h1>
        <p style="color:rgba(255,255,255,0.75);margin:8px 0 0;font-size:14px;">Precision Farming Intelligence Platform</p>
      </td></tr>

      <tr><td style="padding:44px 48px;">
        <h2 style="color:#0f172a;font-size:24px;margin:0 0 12px;font-weight:700;">Reset Your Password</h2>
        <p style="color:#64748b;line-height:1.8;margin:0 0 28px;font-size:15px;">
          Hi <strong style="color:#1e293b;">{username}</strong>,<br><br>
          We received a request to reset your AgriSense AI account password.
          Click the button below to create a new password.
          This link will <strong>expire in 30 minutes</strong>.
        </p>

        <div style="text-align:center;margin:36px 0;">
          <a href="{reset_url}"
             style="display:inline-block;background:linear-gradient(135deg,#2E7D32,#43a047,#66BB6A);
                    color:white;text-decoration:none;padding:18px 48px;border-radius:14px;
                    font-weight:800;font-size:17px;letter-spacing:0.3px;
                    box-shadow:0 8px 24px rgba(46,125,50,0.35);">
            🔐 Reset My Password
          </a>
        </div>

        <div style="background:#f8fafc;border-radius:12px;padding:18px 20px;margin-top:28px;border:1px solid #e2e8f0;">
          <p style="color:#64748b;font-size:13px;margin:0 0 8px;font-weight:600;">Or copy this link into your browser:</p>
          <a href="{reset_url}" style="color:#2E7D32;font-size:12px;word-break:break-all;">{reset_url}</a>
        </div>

        <p style="color:#94a3b8;font-size:13px;margin:24px 0 0;line-height:1.7;">
          If you didn't request a password reset, you can safely ignore this email.
          Your password will not change until you click the link above and create a new one.
        </p>
      </td></tr>

      <tr><td style="background:#f8fafc;padding:24px 48px;text-align:center;border-top:1px solid #f1f5f9;">
        <p style="color:#94a3b8;font-size:12px;margin:0;">
          © 2025 AgriSense AI · Precision Agriculture Platform<br>
          This is an automated message — please do not reply.
        </p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>"""
