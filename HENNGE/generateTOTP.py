import pyotp
import time
import hmac
import hashlib
import base64


def generate_totp(email):
    secret = email + "HENNGECHALLENGE004"
    # Encode secret to base32 manually
    key = secret.encode()
    totp = pyotp.TOTP(
        s=base64.b32encode(key), digits=10, interval=30, digest=hashlib.sha512
    )
    return totp.now()


email = "am44910606@gmail.com"
print("TOTP:", generate_totp(email))
