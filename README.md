# OfficePal

## Proje Tanımı

Kurum içi ekiplerin görevlerini ve projelerini düzenli şekilde takip edebilmesi için geliştirilecek. Sistem, kullanıcıların proje oluşturmasına, görev tanımlamasına, görev durumlarını güncellemesine ve görevlere yorum eklemesine olanak tanıyacaktır.

Amaç kullanıcıların, projeler oluşturabilmesi, projelere açıklama girilmesi, her projeye görev tanımlayabilmesi, bu görevlerin durumlarını adım adım güncelleyebilmesi, görevlere açıklama tanımlayabilmesi ve görevler üzerinden ekip arkadaşlarıyla yazılı iletişim (yorum) kurabilmesidir.

Ekiplerin iş takibini yapabileceği, sade ve güvenli bir görev yönetim sistemi inşa edilecektir.

Kullanıcı sisteme giriş yaptıktan sonra aşağıdaki işlemleri yapabilir:

1. **Proje Yönetimi:** Yeni projeler oluşturabilir. Yalnızca kendi oluşturduğu projeleri görebilir.
2. **Görev Yönetimi:** Projelerine görevler tanımlayabilir. Görevleri başka kullanıcılara atayabilir. Kendi veya atandığı görevlerin durumlarını güncelleyebilir. Görevlerin durumu 3 farklı durumu olacak: TODO, IN_PROGRESS, COMPLETED.
3. **Yorum Sistemi:** Görevlere yorum ekleyebilir. Sadece kendi yazdığı yorumları düzenleyebilir veya silebilir.
4. **Kimlik Doğrulama:** Sisteme kayıt olabilir. Güvenli giriş yaptıktan sonra sisteme erişebilir.

### Yetkilendirme Kuralları
- **Projeler:** Her kullanıcı yalnızca kendi projelerini görür.
- **Görevler:** Kullanıcı, sadece kendi projelerine görev ekleyebilir. Bir görev kendisine atandıysa, o görevi görebilir ve durumunu değiştirebilir.
- **Yorumlar:** Kullanıcı sadece kendi yazdığı yorumları silebilir. Yorumlar, görevin görünür olduğu kullanıcılar tarafından görülebilir.

### Örnek Senaryo
1. **Proje Oluşturma ve Görev Atama**
   - Ahmet sisteme giriş yapar ve "Web Sitesi Yenileme" adında bir proje oluşturur.
   - Bu proje altına iki görev tanımlar.
     - “Tasarım hazırla” → Ahmet’e atanır
     - “API bağlantısını yap” → Zeynep’e atanır
2. **Görev Takibi ve Yorumlar**
   - Zeynep, kendisine atanan görevi görür ve durumunu “IN_PROGRESS” olarak günceller.
   - Her iki kullanıcı da görev altında yorum yapar:
     - Ahmet: "Tasarım Figma’da tamamlandı."
     - Zeynep: "API uç noktaları test edildi."
3. **Erişim Kontrolü**
   - Projeye yalnızca proje sahibi olan Ahmet tam erişim sağlar.
   - Zeynep ise sadece kendisine atanan görevi ve o göreve ait yorumları görebilir.

### Güvenlik Gereksinimleri
- **JWT Token Sistemi:** Kullanıcı giriş yaptıktan sonra kendisine bir JWT token verilir. Bu token, tüm korumalı API isteklerinde Authorization: Bearer <token> başlığıyla gönderilmelidir. Token gönderilmeden erişilmek istenen endpoint’ler otomatik olarak 401 Unauthorized hatası döner.
- **Spring Security Yapılandırması:**
  - Serbest Erişim: /auth/register, /auth/login
  - Korumalı Alanlar: Diğer tüm API’ler (proje, görev, yorum gibi)
  - Geçersiz Token: Hatalı veya süresi dolmuş tokenlar reddedilir.

Bu backend servisiyle birlikte, aynı sistemin React ile geliştirilecek bir frontend uygulaması da planlanmaktadır.