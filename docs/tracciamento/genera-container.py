"""Genera gtm-web-container.json: il container GTM web di gabetti-adg.it da importare in GTM.

Uso:  python3 docs/tracciamento/genera-container.py
Il formato eventi del sito è descritto in docs/tracciamento/README.md.
Per cambiare un tag, modificare questo file e rigenerare il JSON (non modificare il JSON a mano).
"""
import json
import os
from datetime import datetime, timezone

GTM_PUBLIC_ID = "GTM-TLKTBLW6"
GA4_ID = "G-NHHJW2WXSH"
META_PIXEL_ID = "996516643236051"
SGTM_URL = "https://sgtm.gabetti-adg.it"

ACC, CON = "0", "0"
_ids = {"tag": 0, "trigger": 0, "variable": 0}


def nid(kind, base):
    _ids[kind] += 1
    return str(base + _ids[kind])


def T(key, value):
    return {"type": "TEMPLATE", "key": key, "value": value}


def B(key, value):
    return {"type": "BOOLEAN", "key": key, "value": "true" if value else "false"}


def table(key, rows):
    return {"type": "LIST", "key": key, "list": [
        {"type": "MAP", "map": [T("parameter", k), T("parameterValue", v)]} for k, v in rows
    ]}


def cond(kind, arg0, arg1, negate=False):
    p = [T("arg0", arg0), T("arg1", arg1)]
    if negate:
        p.append(B("negate", True))
    return {"type": kind, "parameter": p}


# ---------- Variabili ----------
variables = []


def const(name, value):
    variables.append({"accountId": ACC, "containerId": CON, "variableId": nid("variable", 100),
                      "name": name, "type": "c", "parameter": [T("value", value)], "fingerprint": "0"})
    return "{{" + name + "}}"


def dlv(key):
    name = "dlv - " + key
    variables.append({"accountId": ACC, "containerId": CON, "variableId": nid("variable", 100),
                      "name": name, "type": "v",
                      "parameter": [{"type": "INTEGER", "key": "dataLayerVersion", "value": "2"},
                                    B("setDefaultValue", False), T("name", key)],
                      "fingerprint": "0"})
    return "{{" + name + "}}"


V_GA4 = const("const - GA4 Measurement ID", GA4_ID)
V_PIXEL = const("const - Meta Pixel ID", META_PIXEL_ID)
V_SGTM = const("const - Server GTM URL", SGTM_URL)
V_ADS = const("const - Google Ads Conversion ID", "DA_INSERIRE")
V = {k: dlv(k) for k in ["form_name", "lead_category", "lead_type", "project", "event_id", "value",
                         "currency", "step", "click_url", "cta_text", "consent_marketing", "page_path"]}

# ---------- Trigger ----------
triggers = []
ALL_PAGES = "2147479553"        # integrato: All Pages
INIT_ALL_PAGES = "2147479573"   # integrato: Initialization - All Pages


def custom_event(name, event, filters=None, regex=False):
    t = {"accountId": ACC, "containerId": CON, "triggerId": nid("trigger", 200), "name": name,
         "type": "CUSTOM_EVENT",
         "customEventFilter": [cond("MATCH_REGEX" if regex else "EQUALS", "{{_event}}", event)],
         "fingerprint": "0"}
    if filters:
        t["filter"] = filters
    triggers.append(t)
    return t["triggerId"]


TR_LEAD = custom_event("CE - generate_lead (tutti)", "generate_lead")
TR_LEAD_NO_VISITA = custom_event("CE - generate_lead (escluse visite)", "generate_lead",
                                 [cond("EQUALS", V["lead_type"], "visita", negate=True)])
TR_LEAD_VISITA = custom_event("CE - generate_lead (prenota visita)", "generate_lead",
                              [cond("EQUALS", V["lead_type"], "visita")])
TR_LEAD_VENDITA = custom_event("CE - generate_lead (vendita)", "generate_lead",
                               [cond("EQUALS", V["lead_category"], "vendita")])
TR_LEAD_CANTIERI = custom_event("CE - generate_lead (nuove costruzioni)", "generate_lead",
                                [cond("EQUALS", V["lead_category"], "nuove_costruzioni")])
TR_JOB = custom_event("CE - job_application", "job_application")
TR_CONTACT = custom_event("CE - click_whatsapp | click_phone", "^(click_whatsapp|click_phone)$", regex=True)
TR_CTA = custom_event("CE - cta_click", "cta_click")
TR_STEP = custom_event("CE - form_step", "form_step")
TR_CONSENT_MK = custom_event("CE - consenso marketing dato", "cookie_consent_update",
                             [cond("EQUALS", V["consent_marketing"], "true")])

TR_HISTORY = nid("trigger", 200)
triggers.append({"accountId": ACC, "containerId": CON, "triggerId": TR_HISTORY,
                 "name": "Cambio pagina (pushState / popstate)", "type": "HISTORY_CHANGE",
                 "filter": [cond("MATCH_REGEX", "{{History Source}}", "^(pushState|popstate)$")],
                 "fingerprint": "0"})

# ---------- Tag ----------
tags = []
NEEDS_AD_STORAGE = {"consentStatus": "NEEDED",
                    "consentType": {"type": "LIST", "list": [{"type": "TEMPLATE", "value": "ad_storage"}]}}


def tag(name, type_, params, firing, paused=False, consent=None, notes=None):
    t = {"accountId": ACC, "containerId": CON, "tagId": nid("tag", 300), "name": name, "type": type_,
         "parameter": params, "firingTriggerId": firing, "tagFiringOption": "ONCE_PER_EVENT",
         "monitoringMetadata": {"type": "MAP"}, "fingerprint": "0"}
    if paused:
        t["paused"] = True
    if consent:
        t["consentSettings"] = consent
    if notes:
        t["notes"] = notes
    tags.append(t)


def html(code):
    return [T("html", code), B("supportDocumentWrite", False)]


# GA4
tag("GA4 - Google tag", "googtag",
    [T("tagId", V_GA4), table("configSettingsTable", [("server_container_url", V_SGTM)])],
    [INIT_ALL_PAGES],
    notes="Unico tag di configurazione GA4. Manda la page_view del primo caricamento. "
          "In GA4 disattivare 'Modifiche della pagina in base agli eventi della cronologia del browser' "
          "nella misurazione avanzata: i cambi pagina li manda il tag 'GA4 - page_view (cambio pagina)'.")


def ga4_event(name, event_name, params, firing):
    tag(name, "gaawe",
        [B("sendEcommerceData", False), T("eventName", event_name), T("measurementIdOverride", V_GA4),
         table("eventSettingsTable", params)],
        firing)


ga4_event("GA4 - page_view (cambio pagina)", "page_view",
          [("page_location", "{{Page URL}}"), ("page_title", "{{Page Title}}")], [TR_HISTORY])
ga4_event("GA4 - generate_lead", "generate_lead",
          [("form_name", V["form_name"]), ("lead_category", V["lead_category"]), ("lead_type", V["lead_type"]),
           ("project", V["project"]), ("value", V["value"]), ("currency", V["currency"]),
           ("event_id", V["event_id"])],
          [TR_LEAD])
ga4_event("GA4 - job_application", "job_application",
          [("form_name", V["form_name"]), ("event_id", V["event_id"])], [TR_JOB])
ga4_event("GA4 - click contatto (WhatsApp / telefono)", "{{Event}}",
          [("click_url", V["click_url"]), ("event_id", V["event_id"])], [TR_CONTACT])
ga4_event("GA4 - cta_click", "cta_click", [("cta_text", V["cta_text"])], [TR_CTA])
ga4_event("GA4 - form_step", "form_step", [("form_name", V["form_name"]), ("step", V["step"])], [TR_STEP])

# Meta Pixel (solo con consenso marketing: ad_storage)
PIXEL_BASE = """<script>
(function () {
  // Una sola PageView per caricamento: questo tag scatta su All Pages (consenso già dato)
  // oppure quando l'utente accetta il marketing dal banner.
  if (window.__gabettiPixel) return;
  window.__gabettiPixel = true;
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
  document,'script','https://connect.facebook.net/en_US/fbevents.js');
  // I cambi pagina li manda il tag "Meta - PageView (cambio pagina)": niente tracciamento automatico.
  fbq.disablePushState = true;
  // Niente eventi automatici sui clic (SubscribedButtonClick)
  fbq('set', 'autoConfig', false, {{const - Meta Pixel ID}});
  fbq('init', {{const - Meta Pixel ID}});
  fbq('track', 'PageView');
})();
</script>"""

PIXEL_PAGEVIEW = """<script>
  if (window.fbq && window.__gabettiPixel) fbq('track', 'PageView');
</script>"""


def pixel_event(event, custom):
    return """<script>
(function () {
  if (!window.fbq || !window.__gabettiPixel) return;
  var data = %s;
  for (var k in data) if (data[k] === undefined || data[k] === null || data[k] === '') delete data[k];
  fbq('track', '%s', data, { eventID: {{dlv - event_id}} });
})();
</script>""" % (custom, event)


LEAD_DATA = """{
    content_name: {{dlv - form_name}},
    content_category: {{dlv - lead_category}},
    project: {{dlv - project}},
    value: {{dlv - value}},
    currency: {{dlv - currency}}
  }"""

tag("Meta - Pixel base + PageView", "html", html(PIXEL_BASE), [ALL_PAGES, TR_CONSENT_MK],
    consent=NEEDS_AD_STORAGE)
tag("Meta - PageView (cambio pagina)", "html", html(PIXEL_PAGEVIEW), [TR_HISTORY], consent=NEEDS_AD_STORAGE)
tag("Meta - Lead", "html", html(pixel_event("Lead", LEAD_DATA)), [TR_LEAD_NO_VISITA], consent=NEEDS_AD_STORAGE,
    notes="Tutti i lead commerciali (vendita, nuove costruzioni, info immobile). Per ottimizzare una campagna su un "
          "solo tipo creare in Events Manager una conversione personalizzata su Lead filtrata per content_name.")
tag("Meta - Schedule (prenota visita)", "html", html(pixel_event("Schedule", LEAD_DATA)), [TR_LEAD_VISITA],
    consent=NEEDS_AD_STORAGE)
tag("Meta - SubmitApplication (candidatura)", "html",
    html(pixel_event("SubmitApplication", "{ content_name: {{dlv - form_name}} }")), [TR_JOB],
    consent=NEEDS_AD_STORAGE, notes="Candidature CV: evento separato, non usarlo per le campagne lead.")
tag("Meta - Contact (WhatsApp / telefono)", "html",
    html(pixel_event("Contact", "{ content_name: {{Event}}, content_category: {{dlv - page_path}} }")),
    [TR_CONTACT], consent=NEEDS_AD_STORAGE)

# Google Ads (in pausa finché non si inseriscono ID ed etichette)
tag("Google Ads - Linker conversioni", "gclidw",
    [B("enableCrossDomain", False), B("enableUrlPassthrough", True), B("enableCookieOverrides", False)],
    [ALL_PAGES])


def ads_conversion(name, firing):
    tag(name, "awct",
        [T("conversionId", V_ADS), T("conversionLabel", "DA_INSERIRE"), T("conversionValue", V["value"]),
         T("currencyCode", "EUR"), T("orderId", V["event_id"]), B("enableConversionLinker", True)],
        firing, paused=True,
        notes="In pausa: inserire l'ID conversione (costante 'const - Google Ads Conversion ID') e l'etichetta, "
              "attivare 'Includi dati forniti dall'utente' (conversioni avanzate) e riattivare.")


ads_conversion("Google Ads - Conversione Lead Valutazione", [TR_LEAD_VENDITA])
ads_conversion("Google Ads - Conversione Lead Nuove costruzioni", [TR_LEAD_CANTIERI])

BUILTIN = [("EVENT", "Event"), ("PAGE_URL", "Page URL"), ("PAGE_PATH", "Page Path"),
           ("PAGE_HOSTNAME", "Page Hostname"), ("REFERRER", "Referrer"), ("HISTORY_SOURCE", "History Source"),
           ("PAGE_TITLE", "Page Title")]
# PAGE_TITLE non è una variabile integrata: la creiamo come variabile JavaScript
BUILTIN = [b for b in BUILTIN if b[0] != "PAGE_TITLE"]
variables.append({"accountId": ACC, "containerId": CON, "variableId": nid("variable", 100), "name": "Page Title",
                  "type": "j", "parameter": [T("name", "document.title")], "fingerprint": "0"})

out = {
    "exportFormatVersion": 2,
    "exportTime": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S"),
    "containerVersion": {
        "path": f"accounts/{ACC}/containers/{CON}/versions/0",
        "accountId": ACC, "containerId": CON, "containerVersionId": "0",
        "container": {"path": f"accounts/{ACC}/containers/{CON}", "accountId": ACC, "containerId": CON,
                      "name": "gabetti-adg.it", "publicId": GTM_PUBLIC_ID, "usageContext": ["WEB"],
                      "fingerprint": "0"},
        "tag": tags,
        "trigger": triggers,
        "variable": variables,
        "builtInVariable": [{"accountId": ACC, "containerId": CON, "type": t, "name": n} for t, n in BUILTIN],
        "fingerprint": "0",
    },
}

dest = os.path.join(os.path.dirname(os.path.abspath(__file__)), "gtm-web-container.json")
with open(dest, "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=2)
print(f"Scritto {dest}: {len(tags)} tag, {len(triggers)} trigger, {len(variables)} variabili")
