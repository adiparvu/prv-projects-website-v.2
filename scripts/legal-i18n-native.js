/**
 * Native FAQ + privacy translations: PL, ES, IT, TR, AR, RU, UK
 */
const fs = require("fs");
const path = require("path");

const packs = {
  pl: {
    "footer.faq": "FAQ",
    "footer.privacy": "Prywatność",
    "faq.title": "Najczęstsze pytania",
    "faq.sub": "Odpowiedzi na temat kosztów, terminów, gwarancji i naszej pracy w Belgii.",
    "faq.q1": "Ile kosztuje kompleksowy remont?",
    "faq.a1":
      "Zależy od metrażu, stanu, materiałów i lokalizacji. Orientacyjnie remonty premium w Belgii często zaczynają się od 800–1400 €/m². Przed podpisaniem umowy otrzymujesz szczegółową wycenę według kategorii.",
    "faq.q2": "Jak długo trwa typowy projekt?",
    "faq.a2":
      "Mieszkanie 60–90 m²: około 8–14 tygodni. Większe domy lub specjalne wykończenia: 4–6 miesięcy. Ustalony termin jest wpisany w umowę.",
    "faq.q3": "Pracujecie tylko w Brukseli?",
    "faq.a3":
      "Nie. Obsługujemy całą Belgię — Bruksela, Antwerpia, Gandawa, Brugia, Leuven, Liège, Namur, Charleroi, Mechelen, Hasselt, Mons i okolice.",
    "faq.q4": "Czy wycena jest bezpłatna?",
    "faq.a4":
      "Tak. Wizyta i orientacyjna wycena są bezpłatne i niezobowiązujące. Szczegółowa oferta następuje po pomiarach i jasnym planie.",
    "faq.q5": "Jakie gwarancje oferujecie?",
    "faq.a5":
      "Dziesięcioletnia gwarancja na prace konstrukcyjne zgodnie z prawem belgijskim oraz 2 lata na wykończenia. Dokumentacja przekazywana przy odbiorze.",
    "faq.q6": "Czy budżet może pozostać stały?",
    "faq.a6":
      "Tak — po zatwierdzeniu planów pracujemy z wyceną kategorii i stałą ceną. Każda zmiana jest wyceniana i zatwierdzana przed wykonaniem.",
    "faq.q7": "Kto nadzoruje plac budowy?",
    "faq.a7":
      "Dedykowany kierownik budowy — jeden punkt kontaktu. Codzienny raport ze zdjęciami, zwykle przez WhatsApp lub e-mail.",
    "faq.q8": "Jak rozpocząć współpracę?",
    "faq.a8":
      "Wyślij plany, szkice lub zdjęcia przez formularz kontaktowy lub na hello@prvprojects.be. Odpowiadamy w ciągu 24 godzin z kolejnymi krokami.",
    "faq.cta": "Nie znalazłeś odpowiedzi?",
    "privacy.title": "Polityka prywatności",
    "privacy.updated": "Ostatnia aktualizacja: maj 2026",
    "privacy.intro":
      "PRV Projects przestrzega rozporządzenia (UE) 2016/679 (RODO) oraz belgijskiego prawa o ochronie danych osobowych.",
    "privacy.s1.title": "1. Administrator danych",
    "privacy.s1.body":
      "Administrator: PRV Projects — remonty wnętrz w Belgii. W sprawach danych osobowych: hello@prvprojects.be.",
    "privacy.s2.title": "2. Jakie dane zbieramy",
    "privacy.s2.body":
      "Dane z formularzy (imię, e-mail, telefon, miasto, szczegóły projektu); e-mail newslettera; dane techniczne (IP, przeglądarka, odwiedzone strony) przez niezbędne pliki cookie lub — za Twoją zgodą — analitykę.",
    "privacy.s3.title": "3. Cele i podstawa prawna",
    "privacy.s3.body":
      "Odpowiedzi na zapytania ofertowe, zawieranie i realizacja umowy, komunikacja marketingowa za zgodą, bezpieczeństwo i ulepszanie strony (analityka tylko za zgodą). Podstawy: działania przedumowne, umowa, prawnie uzasadniony interes, zgoda tam, gdzie wymagana.",
    "privacy.s4.title": "4. Pliki cookie",
    "privacy.s4.body":
      "Niezbędne: działanie strony, język i motyw. Analityka (np. Google Analytics): tylko po wybraniu „Akceptuj wszystkie” w banerze. Zgodę możesz wycofać w ustawieniach przeglądarki lub odrzucając przy pierwszej wizycie.",
    "privacy.s5.title": "5. Odbiorcy danych",
    "privacy.s5.body":
      "Hosting, dostawcy formularzy (np. FormSubmit), e-mail oraz — w razie potrzeby — księgowość lub doradcy prawni. Nie sprzedajemy Twoich danych. Transfer poza EOG tylko z odpowiednimi zabezpieczeniami, jeśli jest konieczny.",
    "privacy.s6.title": "6. Okres przechowywania",
    "privacy.s6.body":
      "Zapytania bez umowy: do 24 miesięcy. Dane umowne: czas współpracy plus ustawowe terminy archiwizacji. Newsletter: do wypisania się.",
    "privacy.s7.title": "7. Twoje prawa",
    "privacy.s7.body":
      "Dostęp, sprostowanie, usunięcie, ograniczenie, przenoszenie, sprzeciw, wycofanie zgody i skarga do belgijskiego Urzędu Ochrony Danych (APD/GBA). Kontakt: hello@prvprojects.be — odpowiadamy w ciągu 30 dni.",
    "privacy.s8.title": "8. Zmiany",
    "privacy.s8.body":
      "Możemy aktualizować niniejszą politykę. Obowiązująca wersja jest opublikowana na tej stronie z datą podaną powyżej.",
    "privacy.linkFaq": "Najczęstsze pytania (FAQ)",
  },
  es: {
    "footer.faq": "FAQ",
    "footer.privacy": "Privacidad",
    "faq.title": "Preguntas frecuentes",
    "faq.sub": "Respuestas sobre costes, plazos, garantías y cómo trabajamos en Bélgica.",
    "faq.q1": "¿Cuánto cuesta una reforma integral?",
    "faq.a1":
      "Depende de la superficie, el estado, los materiales y la ubicación. Como referencia, en Bélgica las reformas premium suelen empezar en 800–1.400 €/m². Recibes un presupuesto detallado por categorías antes de firmar.",
    "faq.q2": "¿Cuánto dura un proyecto típico?",
    "faq.a2":
      "Piso de 60–90 m²: unas 8–14 semanas. Casas mayores o acabados especiales: 4–6 meses. El plazo acordado figura en el contrato.",
    "faq.q3": "¿Trabajáis solo en Bruselas?",
    "faq.a3":
      "No. Cubrimos toda Bélgica — Bruselas, Amberes, Gante, Brujas, Lovaina, Lieja, Namur, Charleroi, Malinas, Hasselt, Mons y alrededores.",
    "faq.q4": "¿El presupuesto es gratuito?",
    "faq.a4":
      "Sí. La visita y la estimación orientativa son gratuitas y sin compromiso. El presupuesto detallado sigue a las mediciones y un plan claro.",
    "faq.q5": "¿Qué garantías ofrecéis?",
    "faq.a5":
      "Garantía decenal en obra estructural según la ley belga, más 2 años en acabados. La documentación se entrega en la recepción.",
    "faq.q6": "¿Puede mantenerse el presupuesto fijo?",
    "faq.a6":
      "Sí — tras aprobar los planos trabajamos con presupuesto por categorías y precio fijo. Cualquier cambio se valora y aprueba antes de ejecutar.",
    "faq.q7": "¿Quién supervisa la obra?",
    "faq.a7":
      "Un jefe de obra dedicado — un solo interlocutor. Informe diario con fotos, normalmente por WhatsApp o correo.",
    "faq.q8": "¿Cómo empezamos?",
    "faq.a8":
      "Envía planos, bocetos o fotos por el formulario de contacto o a hello@prvprojects.be. Respondemos en 24 h con los siguientes pasos.",
    "faq.cta": "¿No encuentras la respuesta?",
    "privacy.title": "Política de privacidad",
    "privacy.updated": "Última actualización: mayo de 2026",
    "privacy.intro":
      "PRV Projects cumple el Reglamento (UE) 2016/679 (RGPD) y la legislación belga de protección de datos.",
    "privacy.s1.title": "1. Responsable del tratamiento",
    "privacy.s1.body":
      "Responsable: PRV Projects — reformas interiores en Bélgica. Privacidad: hello@prvprojects.be.",
    "privacy.s2.title": "2. Datos que recogemos",
    "privacy.s2.body":
      "Datos de formularios (nombre, email, teléfono, ciudad, detalles del proyecto); email del boletín; datos técnicos (IP, navegador, páginas visitadas) mediante cookies esenciales o, con tu consentimiento, analítica.",
    "privacy.s3.title": "3. Finalidades y base legal",
    "privacy.s3.body":
      "Responder solicitudes de presupuesto, ejecutar contratos, comunicación comercial con tu consentimiento, seguridad y mejora del sitio (analítica solo con consentimiento). Bases: medidas precontractuales, contrato, interés legítimo, consentimiento cuando proceda.",
    "privacy.s4.title": "4. Cookies",
    "privacy.s4.body":
      "Esenciales: funcionamiento del sitio, idioma y tema. Analítica (p. ej. Google Analytics): solo si eliges «Aceptar todas» en el banner. Puedes retirar el consentimiento en el navegador o rechazarlo en la primera visita.",
    "privacy.s5.title": "5. Destinatarios",
    "privacy.s5.body":
      "Alojamiento, proveedores de formularios (p. ej. FormSubmit), correo y, si aplica, asesoría contable o legal. No vendemos tus datos. Transferencias fuera del EEE solo con garantías adecuadas si es necesario.",
    "privacy.s6.title": "6. Conservación",
    "privacy.s6.body":
      "Consultas sin contrato: hasta 24 meses. Datos contractuales: duración del proyecto más plazos legales de archivo. Boletín: hasta darte de baja.",
    "privacy.s7.title": "7. Tus derechos",
    "privacy.s7.body":
      "Acceso, rectificación, supresión, limitación, portabilidad, oposición, retirada del consentimiento y reclamación ante la Autoridad belga de protección de datos (APD/GBA). hello@prvprojects.be — respondemos en 30 días.",
    "privacy.s8.title": "8. Cambios",
    "privacy.s8.body":
      "Podemos actualizar esta política. La versión vigente es la publicada en esta página con la fecha indicada arriba.",
    "privacy.linkFaq": "Preguntas frecuentes (FAQ)",
  },
  it: {
    "footer.faq": "FAQ",
    "footer.privacy": "Privacy",
    "faq.title": "Domande frequenti",
    "faq.sub": "Risposte su costi, tempi, garanzie e come lavoriamo in Belgio.",
    "faq.q1": "Quanto costa una ristrutturazione completa?",
    "faq.a1":
      "Dipende da metratura, stato, materiali e zona. In Belgio le ristrutturazioni premium partono spesso da 800–1.400 €/m². Preventivo dettagliato per categorie prima della firma.",
    "faq.q2": "Quanto dura un progetto tipico?",
    "faq.a2":
      "Appartamento 60–90 m²: circa 8–14 settimane. Case più grandi o finiture speciali: 4–6 mesi. La scadenza concordata è nel contratto.",
    "faq.q3": "Lavorate solo a Bruxelles?",
    "faq.a3":
      "No. Copriamo tutta la Belgio — Bruxelles, Anversa, Gand, Bruges, Lovanio, Liegi, Namur, Charleroi, Mechelen, Hasselt, Mons e dintorni.",
    "faq.q4": "Il preventivo è gratuito?",
    "faq.a4":
      "Sì. Sopralluogo e stima orientativa gratuiti e senza impegno. Il preventivo dettagliato segue le misurazioni e un piano chiaro.",
    "faq.q5": "Quali garanzie offrite?",
    "faq.a5":
      "Garanzia decennale sulle opere strutturali secondo legge belga, più 2 anni sulle finiture. Documentazione alla consegna.",
    "faq.q6": "Il budget può restare fisso?",
    "faq.a6":
      "Sì — dopo l'approvazione dei piani preventivo per categorie e prezzo fisso. Ogni modifica è stimata e approvata prima dei lavori.",
    "faq.q7": "Chi supervisiona il cantiere?",
    "faq.a7":
      "Un capocantiere dedicato — un solo referente. Report giornaliero con foto, di solito via WhatsApp o email.",
    "faq.q8": "Come iniziamo?",
    "faq.a8":
      "Invia planimetrie, schizzi o foto tramite il modulo contatti o a hello@prvprojects.be. Rispondiamo entro 24 ore con i prossimi passi.",
    "faq.cta": "Non trovi la risposta?",
    "privacy.title": "Informativa sulla privacy",
    "privacy.updated": "Ultimo aggiornamento: maggio 2026",
    "privacy.intro":
      "PRV Projects rispetta il Regolamento (UE) 2016/679 (GDPR) e la legge belga sulla protezione dei dati.",
    "privacy.s1.title": "1. Titolare del trattamento",
    "privacy.s1.body":
      "Titolare: PRV Projects — ristrutturazioni in Belgio. Privacy: hello@prvprojects.be.",
    "privacy.s2.title": "2. Dati raccolti",
    "privacy.s2.body":
      "Dati dai moduli (nome, email, telefono, città, dettagli progetto); email newsletter; dati tecnici (IP, browser, pagine visitate) tramite cookie essenziali o, con consenso, analytics.",
    "privacy.s3.title": "3. Finalità e base giuridica",
    "privacy.s3.body":
      "Risposta a richieste di preventivo, esecuzione del contratto, comunicazioni marketing con consenso, sicurezza e miglioramento del sito (analytics solo con consenso). Basi: misure precontrattuali, contratto, interesse legittimo, consenso ove richiesto.",
    "privacy.s4.title": "4. Cookie",
    "privacy.s4.body":
      "Essenziali: funzionamento del sito, lingua e tema. Analytics (es. Google Analytics): solo se scegli «Accetta tutti» nel banner. Puoi revocare il consenso dal browser o rifiutare alla prima visita.",
    "privacy.s5.title": "5. Destinatari",
    "privacy.s5.body":
      "Hosting, fornitori moduli (es. FormSubmit), email e, se necessario, consulenti contabili o legali. Non vendiamo i tuoi dati. Trasferimenti extra-SEE solo con garanzie adeguate se necessario.",
    "privacy.s6.title": "6. Conservazione",
    "privacy.s6.body":
      "Richieste senza contratto: fino a 24 mesi. Dati contrattuali: durata del progetto più termini di archiviazione legali. Newsletter: fino alla disiscrizione.",
    "privacy.s7.title": "7. I tuoi diritti",
    "privacy.s7.body":
      "Accesso, rettifica, cancellazione, limitazione, portabilità, opposizione, revoca del consenso e reclamo all'Autorità belga (APD/GBA). hello@prvprojects.be — risposta entro 30 giorni.",
    "privacy.s8.title": "8. Modifiche",
    "privacy.s8.body":
      "Possiamo aggiornare questa informativa. La versione applicabile è quella su questa pagina con la data sopra indicata.",
    "privacy.linkFaq": "Domande frequenti (FAQ)",
  },
  tr: {
    "footer.faq": "SSS",
    "footer.privacy": "Gizlilik",
    "faq.title": "Sık sorulan sorular",
    "faq.sub": "Maliyet, süre, garantiler ve Belçika'daki çalışma şeklimiz hakkında yanıtlar.",
    "faq.q1": "Komple tadilat ne kadar tutar?",
    "faq.a1":
      "Metrekare, durum, malzeme ve konuma bağlıdır. Belçika'da premium tadilatlar genelde 800–1.400 €/m² civarından başlar. İmzalamadan önce kategorilere göre ayrıntılı teklif alırsınız.",
    "faq.q2": "Tipik bir proje ne kadar sürer?",
    "faq.a2":
      "60–90 m² daire: yaklaşık 8–14 hafta. Daha büyük evler veya özel işçilik: 4–6 ay. Süre sözleşmeye yazılır.",
    "faq.q3": "Sadece Brüksel'de mi çalışıyorsunuz?",
    "faq.a3":
      "Hayır. Tüm Belçika — Brüksel, Anvers, Gent, Brugge, Leuven, Liège, Namur, Charleroi, Mechelen, Hasselt, Mons ve çevresi.",
    "faq.q4": "Teklif ücretsiz mi?",
    "faq.a4":
      "Evet. Keşif ve yaklaşık fiyat ücretsiz ve bağlayıcı değildir. Ayrıntılı teklif ölçüm ve net plandan sonra gelir.",
    "faq.q5": "Hangi garantileri sunuyorsunuz?",
    "faq.a5":
      "Belçika yasasına göre yapısal işlerde on yıl, bitirme işlerinde 2 yıl garanti. Belgeler teslimatta verilir.",
    "faq.q6": "Bütçe sabit kalabilir mi?",
    "faq.a6":
      "Evet — planlar onaylandıktan sonra kategorili teklif ve sabit fiyat. Her değişiklik işe başlamadan onaylanır.",
    "faq.q7": "Şantiyeyi kim denetler?",
    "faq.a7":
      "Özel bir şantiye şefi — tek muhatap. Genelde WhatsApp veya e-posta ile günlük fotoğraflı rapor.",
    "faq.q8": "Nasıl başlarız?",
    "faq.a8":
      "Plan, eskiz veya fotoğrafları iletişim formu veya hello@prvprojects.be üzerinden gönderin. 24 saat içinde sonraki adımlarla yanıt veririz.",
    "faq.cta": "Cevabınızı bulamadınız mı?",
    "privacy.title": "Gizlilik politikası",
    "privacy.updated": "Son güncelleme: Mayıs 2026",
    "privacy.intro":
      "PRV Projects, (AB) 2016/679 (GDPR) ve Belçika veri koruma mevzuatına uyar.",
    "privacy.s1.title": "1. Veri sorumlusu",
    "privacy.s1.body":
      "Sorumlu: PRV Projects — Belçika'da iç mekân tadilatı. Gizlilik: hello@prvprojects.be.",
    "privacy.s2.title": "2. Topladığımız veriler",
    "privacy.s2.body":
      "Form verileri (ad, e-posta, telefon, şehir, proje detayları); bülten e-postası; zorunlu çerezler veya onayınızla analitik yoluyla teknik veriler (IP, tarayıcı, sayfalar).",
    "privacy.s3.title": "3. Amaçlar ve hukuki dayanak",
    "privacy.s3.body":
      "Teklif taleplerine yanıt, sözleşme, onayınızla pazarlama, site güvenliği ve deneyim (analitik yalnızca onayla). Dayanaklar: ön sözleşme, sözleşme, meşru menfaat, gerektiğinde onay.",
    "privacy.s4.title": "4. Çerezler",
    "privacy.s4.body":
      "Zorunlu: site, dil ve tema. Analitik (ör. Google Analytics): yalnızca banner'da «Tümünü kabul et» seçerseniz. Onayı tarayıcıdan geri alabilir veya ilk ziyarette reddedebilirsiniz.",
    "privacy.s5.title": "5. Alıcılar",
    "privacy.s5.body":
      "Barındırma, form sağlayıcıları (ör. FormSubmit), e-posta ve gerekirse muhasebe/hukuk. Verilerinizi satmayız. AEA dışı aktarım yalnızca gerekli güvencelerle.",
    "privacy.s6.title": "6. Saklama süresi",
    "privacy.s6.body":
      "Sözleşmesiz talepler: en fazla 24 ay. Sözleşme verileri: proje süresi artı yasal arşiv. Bülten: abonelikten çıkana kadar.",
    "privacy.s7.title": "7. Haklarınız",
    "privacy.s7.body":
      "Erişim, düzeltme, silme, kısıtlama, taşınabilirlik, itiraz, onayın geri çekilmesi ve Belçika Veri Koruma Otoritesi'ne (APD/GBA) şikâyet. hello@prvprojects.be — 30 gün içinde yanıt.",
    "privacy.s8.title": "8. Değişiklikler",
    "privacy.s8.body":
      "Bu politikayı güncelleyebiliriz. Geçerli sürüm yukarıdaki tarihle bu sayfada yayımlanan metindir.",
    "privacy.linkFaq": "Sık sorulan sorular (SSS)",
  },
  ar: {
    "footer.faq": "الأسئلة الشائعة",
    "footer.privacy": "الخصوصية",
    "faq.title": "الأسئلة الشائعة",
    "faq.sub": "إجابات حول التكلفة والمدة والضمانات وطريقة عملنا في بلجيكا.",
    "faq.q1": "كم تكلف التجديدات الشاملة؟",
    "faq.a1":
      "يعتمد على المساحة والحالة والمواد والموقع. كمرجع في بلجيكا غالباً من 800–1400 يورو/م² للجودة المميزة. تحصل على عرض مفصل قبل التوقيع.",
    "faq.q2": "كم يستغرق المشروع النموذجي؟",
    "faq.a2":
      "شقة 60–90 م²: حوالي 8–14 أسبوعاً. منازل أكبر أو تشطيبات خاصة: 4–6 أشهر. المدة متفق عليها في العقد.",
    "faq.q3": "هل تعملون في بروكسل فقط؟",
    "faq.a3":
      "لا. نغطي بلجيكا — بروكسل، أنتويرب، غنت، بروج، لوفان، لييج، نامور، شارلروا، ميشيلن، هاسيلت، مونس والمناطق المحيطة.",
    "faq.q4": "هل العرض مجاني؟",
    "faq.a4":
      "نعم. الزيارة والتقدير الأولي مجانيان وبدون التزام. العرض التفصيلي يأتي بعد القياس وخطة واضحة.",
    "faq.q5": "ما الضمانات التي تقدمونها؟",
    "faq.a5":
      "ضمان عشر سنوات للأعمال الإنشائية وفق القانون البلجيكي، وعامان على التشطيبات. تُسلَّم الوثائق عند التسليم.",
    "faq.q6": "هل يمكن تثبيت الميزانية؟",
    "faq.a6":
      "نعم — بعد اعتماد المخططات نعمل بعرض فئوي وسعر ثابت. أي تغيير يُقدَّر ويُوافَق عليه قبل التنفيذ.",
    "faq.q7": "من يشرف على الموقع؟",
    "faq.a7":
      "مشرف موقع مخصص — جهة اتصال واحدة. تقرير يومي بالصور، عادة عبر واتساب أو البريد.",
    "faq.q8": "كيف نبدأ؟",
    "faq.a8":
      "أرسل المخططات أو الصور عبر نموذج الاتصال أو إلى hello@prvprojects.be. نرد خلال 24 ساعة بالخطوات التالية.",
    "faq.cta": "لم تجد إجابتك؟",
    "privacy.title": "سياسة الخصوصية",
    "privacy.updated": "آخر تحديث: مايو 2026",
    "privacy.intro":
      "تلتزم PRV Projects باللائحة (الاتحاد الأوروبي) 2016/679 (GDPR) وتشريعات حماية البيانات البلجيكية.",
    "privacy.s1.title": "1. مسؤول البيانات",
    "privacy.s1.body":
      "المسؤول: PRV Projects — تجديدات داخلية في بلجيكا. الخصوصية: hello@prvprojects.be.",
    "privacy.s2.title": "2. البيانات التي نجمعها",
    "privacy.s2.body":
      "بيانات النماذج (الاسم، البريد، الهاتف، المدينة، تفاصيل المشروع)؛ بريد النشرة؛ بيانات تقنية (IP، المتصفح، الصفحات) عبر ملفات أساسية أو بموافقتك للتحليلات.",
    "privacy.s3.title": "3. الأغراض والأساس القانوني",
    "privacy.s3.body":
      "الرد على طلبات العروض، تنفيذ العقد، تسويق بموافقتك، أمان الموقع وتحسينه (التحليلات فقط بموافقة). الأساس: إجراءات ما قبل التعاقد، العقد، المصلحة المشروعة، الموافقة عند الحاجة.",
    "privacy.s4.title": "4. ملفات تعريف الارتباط",
    "privacy.s4.body":
      "أساسية: تشغيل الموقع واللغة والمظهر. التحليلات (مثل Google Analytics): فقط عند اختيار «قبول الكل» في الشريط. يمكنك سحب الموافقة من المتصفح أو الرفض عند الزيارة الأولى.",
    "privacy.s5.title": "5. الجهات المستلمة",
    "privacy.s5.body":
      "الاستضافة، مزودو النماذج (مثل FormSubmit)، البريد وعند الحاجة محاسبة أو قانون. لا نبيع بياناتك. النقل خارج المنطقة الاقتصادية الأوروبية بضمانات مناسبة عند الضرورة.",
    "privacy.s6.title": "6. مدة الاحتفاظ",
    "privacy.s6.body":
      "طلبات دون عقد: حتى 24 شهراً. بيانات العقد: مدة المشروع وفترات الأرشفة القانونية. النشرة: حتى إلغاء الاشتراك.",
    "privacy.s7.title": "7. حقوقك",
    "privacy.s7.body":
      "الوصول، التصحيح، الحذف، التقييد، النقل، الاعتراض، سحب الموافقة والشكوى إلى هيئة حماية البيانات البلجيكية (APD/GBA). hello@prvprojects.be — رد خلال 30 يوماً.",
    "privacy.s8.title": "8. التعديلات",
    "privacy.s8.body":
      "قد نحدّث هذه السياسة. النسخة السارية هي المنشورة على هذه الصفحة بالتاريخ أعلاه.",
    "privacy.linkFaq": "الأسئلة الشائعة",
  },
  ru: {
    "footer.faq": "FAQ",
    "footer.privacy": "Конфиденциальность",
    "faq.title": "Частые вопросы",
    "faq.sub": "Ответы о стоимости, сроках, гарантиях и работе в Бельгии.",
    "faq.q1": "Сколько стоит полная реновация?",
    "faq.a1":
      "Зависит от площади, состояния, материалов и города. Ориентир в Бельгии — от 800–1400 €/м² для премиум-качества. Детальная смета по категориям до подписания договора.",
    "faq.q2": "Сколько длится типичный проект?",
    "faq.a2":
      "Квартира 60–90 м²: примерно 8–14 недель. Крупные дома или особая отделка: 4–6 месяцев. Срок фиксируется в договоре.",
    "faq.q3": "Работаете только в Брюсселе?",
    "faq.a3":
      "Нет. Вся Бельгия — Брюссель, Антверпен, Гент, Брюгге, Лёвен, Льеж, Намюр, Шарлеруа, Мехелен, Хасселт, Монс и окрестности.",
    "faq.q4": "Смета бесплатна?",
    "faq.a4":
      "Да. Выезд и ориентировочная оценка бесплатны и без обязательств. Детальное предложение — после замеров и ясного плана.",
    "faq.q5": "Какие гарантии?",
    "faq.a5":
      "Десятилетняя гарантия на конструктив по бельгийскому праву плюс 2 года на отделку. Документы при сдаче объекта.",
    "faq.q6": "Бюджет может быть фиксированным?",
    "faq.a6":
      "Да — после утверждения планов смета по категориям и фиксированная цена. Любые изменения согласуются до работ.",
    "faq.q7": "Кто курирует объект?",
    "faq.a7":
      "Выделенный прораб — один контакт. Ежедневный отчёт с фото, обычно WhatsApp или email.",
    "faq.q8": "Как начать?",
    "faq.a8":
      "Отправьте планы или фото через форму или на hello@prvprojects.be. Ответим в течение 24 часов со следующими шагами.",
    "faq.cta": "Не нашли ответ?",
    "privacy.title": "Политика конфиденциальности",
    "privacy.updated": "Последнее обновление: май 2026",
    "privacy.intro":
      "PRV Projects соблюдает Регламент (ЕС) 2016/679 (GDPR) и бельгийское законодательство о защите данных.",
    "privacy.s1.title": "1. Оператор данных",
    "privacy.s1.body":
      "Оператор: PRV Projects — реновация интерьеров в Бельгии. Конфиденциальность: hello@prvprojects.be.",
    "privacy.s2.title": "2. Какие данные собираем",
    "privacy.s2.body":
      "Данные форм (имя, email, телефон, город, детали проекта); email рассылки; технические данные (IP, браузер, страницы) через необходимые cookie или с вашего согласия — аналитика.",
    "privacy.s3.title": "3. Цели и правовые основания",
    "privacy.s3.body":
      "Ответ на запросы, исполнение договора, маркетинг с согласия, безопасность и улучшение сайта (аналитика только с согласия). Основания: преддоговорные меры, договор, законный интерес, согласие где требуется.",
    "privacy.s4.title": "4. Cookie",
    "privacy.s4.body":
      "Необходимые: работа сайта, язык и тема. Аналитика (напр. Google Analytics): только при выборе «Принять все» в баннере. Согласие можно отозвать в браузере или отклонить при первом визите.",
    "privacy.s5.title": "5. Получатели",
    "privacy.s5.body":
      "Хостинг, формы (напр. FormSubmit), почта и при необходимости бухгалтерия или юристы. Мы не продаём ваши данные. Передача за пределы ЕЭЗ — только с надлежащими гарантиями.",
    "privacy.s6.title": "6. Срок хранения",
    "privacy.s6.body":
      "Запросы без договора: до 24 месяцев. Договорные данные: срок проекта плюс законное архивирование. Рассылка: до отписки.",
    "privacy.s7.title": "7. Ваши права",
    "privacy.s7.body":
      "Доступ, исправление, удаление, ограничение, переносимость, возражение, отзыв согласия и жалоба в бельгийский орган APD/GBA. hello@prvprojects.be — ответ в течение 30 дней.",
    "privacy.s8.title": "8. Изменения",
    "privacy.s8.body":
      "Мы можем обновлять политику. Действующая версия опубликована на этой странице с датой выше.",
    "privacy.linkFaq": "Частые вопросы (FAQ)",
  },
  uk: {
    "footer.faq": "FAQ",
    "footer.privacy": "Конфіденційність",
    "faq.title": "Поширені запитання",
    "faq.sub": "Відповіді про вартість, терміни, гарантії та роботу в Бельгії.",
    "faq.q1": "Скільки коштує повна реновація?",
    "faq.a1":
      "Залежить від площі, стану, матеріалів і міста. Орієнтир у Бельгії — від 800–1400 €/м² для преміум-якості. Детальний кошторис за категоріями до підписання договору.",
    "faq.q2": "Скільки триває типовий проєкт?",
    "faq.a2":
      "Квартира 60–90 м²: приблизно 8–14 тижнів. Більші будинки або особливе оздоблення: 4–6 місяців. Термін зафіксовано в договорі.",
    "faq.q3": "Працюєте лише в Брюсселі?",
    "faq.a3":
      "Ні. Вся Бельгія — Брюссель, Антверпен, Гент, Брюгге, Левен, Льєж, Намюр, Шарлеруа, Мехелен, Хасселт, Монс та околиці.",
    "faq.q4": "Чи безкоштовний кошторис?",
    "faq.a4":
      "Так. Візит і орієнтовна оцінка безкоштовні та без зобов'язань. Детальна пропозиція — після замірів і чіткого плану.",
    "faq.q5": "Які гарантії?",
    "faq.a5":
      "Десятирічна гарантія на конструктив за бельгійським правом плюс 2 роки на оздоблення. Документи при здачі об'єкта.",
    "faq.q6": "Чи може бюджет бути фіксованим?",
    "faq.a6":
      "Так — після затвердження планів кошторис за категоріями та фіксована ціна. Будь-які зміни погоджуються до робіт.",
    "faq.q7": "Хто керує об'єктом?",
    "faq.a7":
      "Виділений прораб — один контакт. Щоденний звіт із фото, зазвичай WhatsApp або email.",
    "faq.q8": "Як почати?",
    "faq.a8":
      "Надішліть плани або фото через форму або на hello@prvprojects.be. Відповімо протягом 24 годин із наступними кроками.",
    "faq.cta": "Не знайшли відповідь?",
    "privacy.title": "Політика конфіденційності",
    "privacy.updated": "Останнє оновлення: травень 2026",
    "privacy.intro":
      "PRV Projects дотримується Регламенту (ЄС) 2016/679 (GDPR) та бельгійського законодавства про захист даних.",
    "privacy.s1.title": "1. Оператор даних",
    "privacy.s1.body":
      "Оператор: PRV Projects — реновація інтер'єрів у Бельгії. Конфіденційність: hello@prvprojects.be.",
    "privacy.s2.title": "2. Які дані збираємо",
    "privacy.s2.body":
      "Дані з форм (ім'я, email, телефон, місто, деталі проєкту); email розсилки; технічні дані (IP, браузер, сторінки) через необхідні cookie або за вашою згодою — аналітика.",
    "privacy.s3.title": "3. Цілі та правові підстави",
    "privacy.s3.body":
      "Відповідь на запити, виконання договору, маркетинг за згодою, безпека та покращення сайту (аналітика лише за згодою). Підстави: переддоговірні заходи, договір, законний інтерес, згода де потрібно.",
    "privacy.s4.title": "4. Cookie",
    "privacy.s4.body":
      "Необхідні: робота сайту, мова та тема. Аналітика (напр. Google Analytics): лише після «Прийняти все» у банері. Згоду можна відкликати в браузері або відхилити при першому візиті.",
    "privacy.s5.title": "5. Отримувачі",
    "privacy.s5.body":
      "Хостинг, форми (напр. FormSubmit), пошта та за потреби бухгалтерія чи юристи. Ми не продаємо ваші дані. Передача за межі ЄЕЗ — лише з належними гарантіями.",
    "privacy.s6.title": "6. Термін зберігання",
    "privacy.s6.body":
      "Запити без договору: до 24 місяців. Договірні дані: тривалість проєкту плюс законне архівування. Розсилка: до відписки.",
    "privacy.s7.title": "7. Ваші права",
    "privacy.s7.body":
      "Доступ, виправлення, видалення, обмеження, переносимість, заперечення, відкликання згоди та скарга до бельгійського органу APD/GBA. hello@prvprojects.be — відповідь протягом 30 днів.",
    "privacy.s8.title": "8. Зміни",
    "privacy.s8.body":
      "Ми можемо оновлювати політику. Чинна версія опублікована на цій сторінці з датою вище.",
    "privacy.linkFaq": "Поширені запитання (FAQ)",
  },
};

const dir = path.join(__dirname, "../js/translations");
for (const [code, patch] of Object.entries(packs)) {
  const file = path.join(dir, `${code}.json`);
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  Object.assign(data, patch);
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
  console.log("native legal i18n:", code);
}
