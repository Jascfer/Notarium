# Railway Environment Variables Setup

## Backend (Server) Environment Variables

Railway'de backend projeniz için şu environment variables'ları ayarlayın:

```env
NODE_ENV=production
PORT=4000
POSTGRES_URL=postgresql://postgres:eAnTWVlXpaiFluEOPgwGXVHIyNEsMZJI@postgres.railway.internal:5432/railway
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
FRONTEND_URL=https://notarium.tr
FRONTEND_URL_WWW=https://www.notarium.tr
COOKIE_DOMAIN=.notarium.tr
COOKIE_SECURE=true
COOKIE_SAME_SITE=none
BACKEND_URL=https://notarium-backend-production.up.railway.app
```

## Frontend (Client) Environment Variables

Railway'de frontend projeniz için şu environment variables'ları ayarlayın:

```env
NEXT_PUBLIC_BACKEND_URL=https://notarium-backend-production.up.railway.app
NEXT_PUBLIC_SOCKET_URL=https://notarium-backend-production.up.railway.app
```

## Cloudflare Ayarları

### DNS Ayarları
```
notarium.tr → Frontend (notarium.up.railway.app)
api.notarium.tr → Backend (notarium-backend-production.up.railway.app)
```

### SSL/TLS Ayarları
- **Always Use HTTPS**: ✅
- **Minimum TLS Version**: 1.2
- **Secure Cookie Flag**: ✅

### Page Rules
```
*notarium.tr/* → Bypass cache
*notarium.tr/socket.io* → WebSocket destekle
```

### WebSocket Desteği
- **Network > WebSockets**: ✅ Açık

## API Routing Yapısı

Frontend artık local API routes kullanıyor:
- `/api/auth/*` → Backend `/auth/*` endpoint'lerine proxy
- `/api/notes/*` → Backend `/notes/*` endpoint'lerine proxy
- `/api/quiz/*` → Backend `/quiz/*` endpoint'lerine proxy

Bu sayede CORS sorunları çözülüyor ve Cloudflare Worker üzerinden geçiş sağlanıyor.

## Test Kontrol Listesi

### 1. Tarayıcı DevTools Kontrolleri
- **Application → Cookies → https://notarium.tr** altında `connect.sid` görünüyor mu?
- **Network → /api/auth/me → Request Headers → Cookie** satırı var mı?

### 2. Backend Log Kontrolleri
- **Auth/me - req.session** çıktısında user geliyor mu?
- **Socket.io connection** logları görünüyor mu?

### 3. Debug Sayfası Kontrolleri
- `/debug-auth` endpoint'inde session içerik dolu mu?
- **Cloudflare Checklist** tüm maddeler ✅ mi?

## Test Kullanıcıları

Test user'ları oluşturmak için:

```bash
cd server
node create-test-user.js
```

### Test Kullanıcı Bilgileri
1. **Normal User**: `test@example.com` / `password123`
2. **Admin User**: `admin@example.com` / `admin123`
3. **Founder User**: `founder@example.com` / `founder123`

## Sorun Giderme

### Cookie Sorunları
- **secure: true** ve **sameSite: 'none'** olmazsa cookie gönderilmez
- **Cloudflare** cookie header'ını düşürüyor olabilir
- **HTTPS** kullanıldığından emin olun

### CORS Sorunları
- **credentials: true** ayarlanmış mı?
- **origin** doğru domain'i içeriyor mu?
- **Cloudflare** CORS header'larını değiştiriyor olabilir

### Socket.io Sorunları
- **WebSocket** desteği açık mı?
- **proxy_read_timeout** değerleri yeterli mi?
- **Cloudflare Workers** kullanıyorsan WebSocket desteği var mı?

## Önemli Notlar

1. **Railway'de environment variables** eksiksiz ve doğru girilmeli
2. **Cloudflare ile test** yaparken sadece `notarium.tr` üzerinden test edin
3. **HTTPS** kullanımı zorunlu (Railway & Cloudflare)
4. **Cookie domain** ayarları cross-domain için optimize edilmeli
5. **Frontend artık local API routes** kullanıyor, direct backend calls yok 