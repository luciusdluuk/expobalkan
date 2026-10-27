/* ExpoBalkan prototype — routing, rendering, carousel, drawer, language.
   Routes (location.hash):
     #adria | #bih | #srb | #mne | #mkd   edition home
     #<ed>-<section>                       section page within an edition (e.g. #mne-econ)
     #story-<id>                           article (e.g. #story-m1)                       */
(function () {
  "use strict";
  var D = window.EB_DATA;
  var ED = {}; D.editions.forEach(function (e) { ED[e.id] = e; });
  var SEC = {}; D.sections.forEach(function (s) { SEC[s.id] = s; });
  var ART = {}; D.articles.forEach(function (a) { ART[a.id] = a; });

  var T = {
    me: {
      latest: "Najnovije", numbers: "Brojevi dana", editions: "Edicije", allEditions: "Sve edicije",
      more: "Više vijesti", moreFrom: "Više iz edicije", fromRegion: "Iz regiona", otherEds: "Ostale edicije",
      sections: "Rubrike", menu: "Meni", close: "Zatvori", subscribe: "Pretplata", read: "Čitaj",
      openEd: "Otvori ediciju", prev: "Prethodna vijest", next: "Sljedeća vijest", carousel: "Glavne vijesti",
      ago: function (m) { return m < 60 ? "prije " + m + " min" : "prije " + Math.round(m / 60) + " h"; },
      nlTitle: "Jutarnji brif", nlText: "Najvažnije vijesti iz ekonomije, finansija i proizvodnje u regionu, svakog radnog dana u 7:00.",
      nlPh: "Vaša e-mail adresa", nlBtn: "Prijavi se", nlOk: "Hvala! Prvi brif stiže sjutra ujutru.",
      about: "O nama", advertise: "Oglašavanje", contact: "Kontakt", careers: "Karijera", company: "Kompanija",
      aboutText: "ExpoBalkan prati ekonomiju, finansije, proizvodnju i energetiku Zapadnog Balkana, sa edicijama za Bosnu i Hercegovinu, Srbiju, Crnu Goru i Sjevernu Makedoniju.",
      proto: "Prototip — sadržaj je ilustrativan.", empty: "U ovoj rubrici još nema vijesti.", back: "Nazad na naslovnu",
      keyFig: "Ključni pokazatelj", newsroom: "Redakcija",
      body2: "Redakcija ExpoBalkana prati ovu temu kroz razgovore s kompanijama, institucijama i analitičarima u regionu. U narednim danima objavićemo detaljnu analizu sa podacima i izjavama sagovornika.",
      body3: "Za kompanije koje posluju u regionu ovo je signal da prate razvoj događaja i planiraju na vrijeme: promjene u propisima, troškovima i tražnji obično stižu brže nego što statistika pokaže.",
      related: "Povezano", home: "Naslovna", lang: "Jezik", photo: "Foto:", theme: "Izgled", white: "Bijela", dark: "Tamna",
      search: "Pretraga", searchPh: "Pretražite vijesti", noResults: "Nema rezultata za", popular: "Popularno", latestNav: "Najnovije", newsletter: "Newsletter",
      mostRead: "Najčitanije", reads: "čitanja", allLatest: "Sve najnovije vijesti", chooseEd: "Izaberite ediciju",
      subTitle: "Pretplata", subText: "Neograničen pristup analizama, podacima i svim edicijama ExpoBalkana.", perMonth: "mjesečno",
      plans: [["Digitalno", "€6,90", "Sve edicije, analize i arhiva na webu i mobilnom."], ["Digitalno + štampa", "€12,90", "Sve iz digitalne pretplate i mjesečni štampani magazin."]],
      choose: "Izaberi", subOk: "Hvala! Poslali smo vam link za završetak pretplate.", samplePrices: "Cijene su primjer za prototip."
    },
    en: {
      latest: "Latest", numbers: "Numbers of the day", editions: "Editions", allEditions: "All editions",
      more: "More stories", moreFrom: "More from", fromRegion: "From the region", otherEds: "Other editions",
      sections: "Sections", menu: "Menu", close: "Close", subscribe: "Subscribe", read: "Read",
      openEd: "Open edition", prev: "Previous story", next: "Next story", carousel: "Top stories",
      ago: function (m) { return m < 60 ? m + " min ago" : Math.round(m / 60) + " h ago"; },
      nlTitle: "The Morning Brief", nlText: "The region's most important economy, finance and production news, every weekday at 7:00.",
      nlPh: "Your email address", nlBtn: "Sign up", nlOk: "Thanks! Your first brief arrives tomorrow morning.",
      about: "About", advertise: "Advertise", contact: "Contact", careers: "Careers", company: "Company",
      aboutText: "ExpoBalkan covers the economy, finance, production and energy of the Western Balkans, with editions for Bosnia & Herzegovina, Serbia, Montenegro and North Macedonia.",
      proto: "Prototype — sample content.", empty: "No stories in this section yet.", back: "Back to the front page",
      keyFig: "Key figure", newsroom: "Newsroom",
      body2: "ExpoBalkan's newsroom is following this story through conversations with companies, institutions and analysts across the region. A full analysis with data and interviews will follow in the coming days.",
      body3: "For companies operating in the region, this is a signal to follow developments and plan early: changes in regulation, costs and demand usually arrive faster than the statistics show.",
      related: "Related", home: "Front page", lang: "Language", photo: "Photo:", theme: "Appearance", white: "White", dark: "Dark",
      search: "Search", searchPh: "Search stories", noResults: "No results for", popular: "Popular", latestNav: "Latest", newsletter: "Newsletter",
      mostRead: "Most read", reads: "reads", allLatest: "All the latest stories", chooseEd: "Choose an edition",
      subTitle: "Subscribe", subText: "Unlimited access to ExpoBalkan analysis, data and every edition.", perMonth: "per month",
      plans: [["Digital", "€6.90", "Every edition, analysis and the archive on web and mobile."], ["Digital + print", "€12.90", "Everything in Digital plus the monthly print magazine."]],
      choose: "Choose", subOk: "Thanks! We sent you a link to finish subscribing.", samplePrices: "Prices are examples for the prototype."
    }
  };

  var lang = "me";
  try { var saved = localStorage.getItem("eb-lang"); if (saved === "me" || saved === "en") lang = saved; } catch (e) {}
  var theme = "light";
  try { if (localStorage.getItem("eb-theme") === "dark") theme = "dark"; } catch (e) {}
  var t = function () { return T[lang]; };
  var L = function (o) { return o[lang]; };

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  /* ---------- route ---------- */
  function parse() {
    var h = (location.hash || "").replace(/^#/, "");
    if (!h) return { ed: "adria", view: "home" };
    if (h.indexOf("story-") === 0) { var a = ART[h.slice(6)]; if (a) return { ed: a.ed, view: "art", art: a }; }
    var p = h.split("-");
    if (ED[p[0]]) {
      if (p[1] && SEC[p[1]]) return { ed: p[0], view: "sec", sec: p[1] };
      if (p[1] === "popular" || p[1] === "latest" || p[1] === "subscribe") return { ed: p[0], view: p[1] };
      return { ed: p[0], view: "home" };
    }
    return { ed: "adria", view: "home" };
  }

  /* ---------- data helpers ---------- */
  function byEd(ed) { return D.articles.filter(function (a) { return ed === "adria" || a.ed === ed; }).sort(function (a, b) { return a.mins - b.mins; }); }
  function onlyEd(ed) { return D.articles.filter(function (a) { return a.ed === ed; }).sort(function (a, b) { return a.mins - b.mins; }); }
  function clock(mins) { var d = new Date(Date.now() - mins * 60000); return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2); }

  /* ---------- pieces ---------- */
  function eb(e, cls) {
    return '<span class="eb ' + (cls || "") + '" aria-hidden="true" style="background:' + e.bg + ";color:" + e.ink + ";--eb-bar:" + e.bar + '"><span>EB</span></span>';
  }

  function rng(seed) { var s = 0; for (var i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) >>> 0; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

  /* Editorial cover: a data graphic in the edition's colours, keyed to the section. */
  function cover(a, opts) {
    var e = ED[a.ed], r = rng(a.id), W = 1600, H = 900, g = "", i;
    var faint = 'fill="' + e.ink + '" fill-opacity="0.12"', acc = 'fill="' + e.bar + '"';
    if (a.sec === "econ") {
      for (i = 0; i < 14; i++) { var bh = 120 + i * 36 + r() * 60; g += '<rect x="' + (720 + i * 58) + '" y="' + (H - bh) + '" width="40" height="' + bh + '" ' + (i === 13 ? acc : faint) + "/>"; }
    } else if (a.sec === "fin") {
      var pts = [], y = 600; for (i = 0; i <= 20; i++) { y = Math.max(160, Math.min(700, y - 18 + (r() - 0.35) * 70)); pts.push((640 + i * 46) + "," + y.toFixed(0)); }
      g += '<polygon points="640,900 ' + pts.join(" ") + ' 1560,900" ' + faint + "/>";
      g += '<polyline points="' + pts.join(" ") + '" fill="none" stroke="' + e.bar + '" stroke-width="8" stroke-linejoin="round"/>';
    } else if (a.sec === "prod") {
      for (var row = 0; row < 7; row++) for (var col = 0; col < 11; col++) {
        var on = r() > 0.82; g += '<rect x="' + (760 + col * 72) + '" y="' + (120 + row * 72) + '" width="52" height="52" ' + (on ? acc : faint) + "/>";
      }
    } else if (a.sec === "energy") {
      for (i = 0; i < 16; i++) { var len = 300 + r() * 600; g += '<rect x="' + (W - 60 - len) + '" y="' + (110 + i * 42) + '" width="' + len + '" height="14" ' + (i % 5 === 2 ? acc : faint) + "/>"; }
    } else if (a.sec === "markets") {
      var p = 500; for (i = 0; i < 18; i++) {
        var o = p, c = p + (r() - 0.45) * 120, hi = Math.min(o, c) - 20 - r() * 60, lo = Math.max(o, c) + 20 + r() * 60, x = 700 + i * 48;
        g += '<rect x="' + (x + 13) + '" y="' + hi + '" width="4" height="' + (lo - hi) + '" ' + faint + "/>";
        g += '<rect x="' + x + '" y="' + Math.min(o, c) + '" width="30" height="' + Math.max(8, Math.abs(c - o)) + '" ' + (c < o ? acc : faint) + "/>";
        p = c;
      }
    } else {
      for (i = 9; i > 0; i--) g += '<circle cx="1240" cy="420" r="' + (i * 52) + '" fill="none" stroke="' + (i === 3 ? e.bar : e.ink) + '" stroke-opacity="' + (i === 3 ? 1 : 0.16) + '" stroke-width="' + (i === 3 ? 10 : 4) + '"/>';
    }
    var label = esc(L(a.fig));
    return graphic(a, W, H, e, g, label) + photo(a, opts && opts.w || 640, opts && opts.credit);
  }

  /* Photo layered over the graphic; if it can't load, the graphic shows instead. */
  function photo(a, w, credit) {
    var k = D.articlePhotos && D.articlePhotos[a.id], p = k && D.photos[k];
    if (!p) return "";
    return '<span class="ph"><img alt="" loading="lazy" decoding="async" src="https://images.unsplash.com/' + p.id + "?auto=format&fit=crop&w=" + w + '&q=70">' +
      (credit ? '<span class="credit">' + esc(t().photo) + " " + esc(p.by) + " / Unsplash</span>" : "") + "</span>";
  }

  function graphic(a, W, H, e, g, label) {
    return '<svg viewBox="0 0 ' + W + " " + H + '" preserveAspectRatio="xMinYMid slice" role="img" aria-label="' + esc(a.fig.v) + " · " + label + '">' +
      '<rect width="' + W + '" height="' + H + '" fill="' + e.bg + '"/>' + g +
      '<rect x="0" y="' + (H - 18) + '" width="' + W + '" height="18" fill="' + e.bar + '"/>' +
      '<text x="80" y="120" fill="' + e.ink + '" fill-opacity="0.8" style="font:600 30px Inter,Arial,sans-serif;letter-spacing:.24em">EB · ' + e.code + " · " + esc(L(SEC[a.sec])).toUpperCase() + "</text>" +
      '<text x="72" y="700" fill="' + e.ink + '" style="font:700 230px \'Inter Tight\',Inter,Arial,sans-serif;letter-spacing:-0.045em">' + esc(a.fig.v) + "</text>" +
      '<text x="80" y="790" fill="' + e.ink + '" fill-opacity="0.85" style="font:500 40px Inter,Arial,sans-serif">' + label + "</text></svg>";
  }

  function kicker(a, withEd) {
    var s = esc(L(SEC[a.sec]));
    if (!withEd || a.ed === "adria") return '<span class="kicker">' + s + "</span>";
    return '<span class="kicker kicker--ed">' + s + " <em>· " + ED[a.ed].code + "</em></span>";
  }
  function meta(a) { return '<div class="meta"><span>' + esc(t().ago(a.mins)) + "</span><span>" + esc(t().newsroom) + " " + ED[a.ed].code + "</span></div>"; }
  function card(a, withEd) {
    return '<a class="card" href="#story-' + a.id + '"><span class="cover">' + cover(a) + "</span>" + kicker(a, withEd) +
      '<h3 class="h3">' + esc(L(a).t) + '</h3><p class="dek dek--sm">' + esc(L(a).d) + "</p>" + meta(a) + "</a>";
  }

  /* ---------- chrome: utility bar, masthead, rails ---------- */
  function chrome(route) {
    var e = ED[route.ed];
    var dateStr; try { dateStr = new Date().toLocaleDateString(lang === "me" ? "sr-Latn-ME" : "en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }); } catch (x) { dateStr = new Date().toDateString(); }
    var tick = (D.tickers[route.ed] || []).map(function (k) {
      var cls = k[2].charAt(0) === "+" ? "up" : k[2].charAt(0) === "-" ? "down" : "";
      return '<span class="num"><b>' + k[0] + "</b>" + k[1] + ' <em class="' + cls + '" style="font-style:normal">' + (k[2] === "0.0" ? "0.0" : k[2]) + "%</em></span>";
    }).join("");
    document.getElementById("util").innerHTML =
      '<div class="wrap"><span class="util__date">' + esc(dateStr) + '</span><div class="ticker" aria-label="Markets">' + tick + "</div></div>";

    var ic = function (d) { return '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6">' + d + "</svg>"; };
    document.getElementById("mast").innerHTML =
      '<div class="wrap"><nav class="mast__left" aria-label="Main">' +
      '<button class="burger" id="burger" aria-controls="drawer" aria-expanded="false"><i><span></span></i><em>' + esc(t().menu) + "</em></button>" +
      '<button class="navlink" id="search-btn" aria-controls="searchbar" aria-expanded="false">' + ic('<circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5 14 14"/>') + "<em>" + esc(t().search) + "</em></button>" +
      '<a class="navlink hide-m" href="#' + e.id + '-popular"' + (route.view === "popular" ? ' aria-current="page"' : "") + ">" + esc(t().popular) + "</a>" +
      '<a class="navlink hide-m" href="#' + e.id + '-latest"' + (route.view === "latest" ? ' aria-current="page"' : "") + ">" + esc(t().latestNav) + "</a>" +
      '<button class="navlink hide-m" data-nl>' + esc(t().newsletter) + "</button></nav>" +
      '<a class="logo" href="#' + e.id + '" aria-label="ExpoBalkan ' + esc(L(e)) + '"><span class="logo__word">ExpoBalkan</span><span class="logo__tag">' + esc(L(e)) + "</span></a>" +
      '<div class="mast__right"><a class="btn btn--solid" href="#' + e.id + '-subscribe">' + esc(t().subscribe) + "</a>" + langToggle() + "</div></div>" +
      '<div class="searchbar" id="searchbar" hidden><div class="wrap"><label class="vh" for="search-q">' + esc(t().searchPh) + '</label><input id="search-q" type="search" autocomplete="off" placeholder="' + esc(t().searchPh) + '"><ol id="search-res"></ol></div></div>';

    drawer(route);
    footer(route);
  }

  function langToggle() {
    return '<div class="lang" role="group" aria-label="' + esc(t().lang) + '"><button data-lang="me" aria-pressed="' + (lang === "me") + '">MNE</button><button data-lang="en" aria-pressed="' + (lang === "en") + '">EN</button></div>';
  }

  function themeToggle() {
    return '<div class="lang" role="group" aria-label="' + esc(t().theme) + '"><button data-theme-set="light" aria-pressed="' + (theme === "light") + '">' + esc(t().white) + '</button><button data-theme-set="dark" aria-pressed="' + (theme === "dark") + '">' + esc(t().dark) + "</button></div>";
  }

  function drawer(route) {
    var e = ED[route.ed];
    document.getElementById("drawer").innerHTML =
      '<div class="drawer__top"><span class="logo__word" style="font-size:22px">ExpoBalkan</span><button class="btn" id="drawer-close">' + esc(t().close) + " ✕</button></div>" +
      "<div><h3>" + esc(t().chooseEd) + '</h3><div class="edpick">' + D.editions.map(function (x) {
        return '<a href="#' + x.id + '" title="' + esc(L(x)) + '"' + (x.id === route.ed ? ' aria-current="page"' : "") + ">" + eb(x) + "<b>" + x.code + "</b></a>";
      }).join("") + "</div></div>" +
      "<div><h3>" + esc(t().sections) + " · " + x(e) + "</h3><ul>" + D.sections.map(function (s) {
        return '<li><a href="#' + e.id + "-" + s.id + '"' + (route.sec === s.id ? ' aria-current="page"' : "") + ">" + esc(L(s)) + "</a></li>";
      }).join("") + '<li><a href="#' + e.id + '-popular">' + esc(t().popular) + '</a></li><li><a href="#' + e.id + '-latest">' + esc(t().latestNav) + "</a></li></ul></div>" +
      "<div><h3>" + esc(t().theme) + "</h3>" + themeToggle() + "</div>" +
      "<div><h3>" + esc(t().company) + '</h3><ul><li><a href="#' + e.id + '">' + esc(t().about) + '</a></li><li><a href="#' + e.id + '">' + esc(t().advertise) + '</a></li><li><a href="#' + e.id + '">' + esc(t().contact) + "</a></li></ul></div>";
    function x(ed) { return ed.code; }
  }

  function footer(route) {
    document.getElementById("foot").innerHTML =
      '<div class="wrap"><div><span class="logo__word" style="font-size:24px">ExpoBalkan</span><p style="max-width:42ch;margin:12px 0 0">' + esc(t().aboutText) + "</p></div>" +
      "<div><h3>" + esc(t().editions) + "</h3><ul>" + D.editions.map(function (x) { return '<li><a href="#' + x.id + '">' + esc(L(x)) + "</a></li>"; }).join("") + "</ul></div>" +
      "<div><h3>" + esc(t().sections) + "</h3><ul>" + D.sections.map(function (s) { return '<li><a href="#' + route.ed + "-" + s.id + '">' + esc(L(s)) + "</a></li>"; }).join("") + "</ul></div>" +
      "<div><h3>" + esc(t().company) + "</h3><ul><li>" + esc(t().about) + "</li><li>" + esc(t().advertise) + "</li><li>" + esc(t().careers) + "</li><li>" + esc(t().contact) + "</li></ul></div></div>" +
      '<div class="foot-base"><div class="wrap"><span>© 2026 ExpoBalkan</span><span>' + esc(t().proto) + "</span></div></div>";
  }

  /* ---------- views ---------- */
  function heroHTML(route) {
    var all = byEd(route.ed);
    var feat = all.filter(function (a) { return a.featured; });
    if (route.ed !== "adria") feat = feat.concat(all.filter(function (a) { return !a.featured; }));
    feat = feat.slice(0, route.ed === "adria" ? 5 : 4);
    var withEd = route.ed === "adria";
    var slides = feat.map(function (a, i) {
      return '<article class="slide" id="slide-' + i + '" role="group" aria-roledescription="slide" aria-label="' + (i + 1) + " / " + feat.length + '"' + (i ? " hidden" : "") + ">" +
        '<a class="cover" href="#story-' + a.id + '" tabindex="-1">' + cover(a, { w: 1200, credit: true }) + "</a>" +
        '<div class="slide__text">' + kicker(a, withEd) + '<a href="#story-' + a.id + '"><h2 class="h1">' + esc(L(a).t) + "</h2></a>" +
        '<p class="dek">' + esc(L(a).d) + "</p>" + meta(a) + "</div></article>";
    }).join("");
    var ctrl = feat.map(function (a, i) {
      return '<button data-go="' + i + '" aria-controls="slide-' + i + '"' + (i === 0 ? ' aria-current="true"' : "") + '><span class="n num">' + ("0" + (i + 1)).slice(-2) + '</span><span class="t">' + esc(L(a).t) + "</span></button>";
    }).join("");
    var latest = all.slice(0, 8).map(function (a) {
      return '<li><a href="#story-' + a.id + '"><time class="num">' + clock(a.mins) + '</time><span><span class="kicker">' + esc(L(SEC[a.sec])) + (withEd && a.ed !== "adria" ? " · " + ED[a.ed].code : "") + '</span><span class="h3">' + esc(L(a).t) + "</span></span></a></li>";
    }).join("");
    return '<section class="hero">' +
      '<div class="carousel" id="carousel" role="region" aria-roledescription="carousel" aria-label="' + esc(t().carousel) + '" style="--n:' + feat.length + '">' +
      '<div class="slides" aria-live="off">' + slides + "</div>" +
      '<div class="car-nav"><button data-step="-1" aria-label="' + esc(t().prev) + '">←</button><button data-step="1" aria-label="' + esc(t().next) + '">→</button></div>' +
      '<div class="car-ctrl">' + ctrl + "</div></div>" +
      '<aside class="latest" aria-labelledby="latest-h"><div class="sec-head"><h2 id="latest-h">' + esc(t().latest) + "</h2></div><ol>" + latest + "</ol></aside></section>";
  }

  function figsHTML(list) {
    return '<section aria-labelledby="figs-h"><div class="sec-head"><h2 id="figs-h">' + esc(t().numbers) + '</h2></div><div class="figs">' +
      list.slice(0, 4).map(function (a) {
        return '<a href="#story-' + a.id + '"><strong class="num">' + esc(a.fig.v) + "</strong><span>" + esc(L(a.fig)) + " · " + ED[a.ed].code + "</span><p>" + esc(L(a).t) + "</p></a>";
      }).join("") + "</div></section>";
  }

  function edGridHTML(ids, title) {
    return '<section aria-labelledby="edg-h"><div class="sec-head"><h2 id="edg-h">' + esc(title) + '</h2></div><div class="edgrid">' +
      ids.map(function (id) {
        var x = ED[id], items = (id === "adria" ? onlyEd("adria") : onlyEd(id)).slice(0, 3);
        return '<div class="edcol"><a class="edcol__head" href="#' + id + '">' + eb(x) + "<span><b>" + esc(L(x)) + "</b><small>" + x.code + "</small></span></a><ul>" +
          items.map(function (a) { return '<li><a href="#story-' + a.id + '">' + kicker(a) + '<span class="h3">' + esc(L(a).t) + "</span></a></li>"; }).join("") +
          '</ul><a class="more" href="#' + id + '">' + esc(t().openEd) + " →</a></div>";
      }).join("") + "</div></section>";
  }

  function gridHTML(list, title, withEd, link) {
    if (!list.length) return "";
    return '<section><div class="sec-head"><h2>' + esc(title) + "</h2>" + (link || "") + '</div><div class="grid">' + list.map(function (a) { return card(a, withEd); }).join("") + "</div></section>";
  }

  function nlHTML() {
    return '<div class="wrap"><div><h2>' + esc(t().nlTitle) + "</h2><p>" + esc(t().nlText) + "</p></div>" +
      '<div><form id="nl-form"><label class="vh" for="nl-email">' + esc(t().nlPh) + '</label><input id="nl-email" type="email" required placeholder="' + esc(t().nlPh) + '"><button type="submit">' + esc(t().nlBtn) + '</button></form><div class="ok" id="nl-ok" hidden>' + esc(t().nlOk) + "</div></div></div>";
  }

  function homeView(route) {
    var ed = route.ed, e = ED[ed];
    var all = byEd(ed);
    var html = heroHTML(route);
    if (ed === "adria") {
      html += figsHTML(all);
      html += edGridHTML(["bih", "srb", "mne", "mkd"], t().editions);
      html += gridHTML(onlyEd("adria").filter(function (a) { return !a.featured; }).concat(all.filter(function (a) { return a.ed !== "adria" && !a.featured; })).slice(0, 6), t().more, true);
    } else {
      var shown = 4;
      html += figsHTML(all);
      html += gridHTML(all.slice(shown), t().moreFrom + " " + L(e), false);
      html += gridHTML(onlyEd("adria").slice(0, 3), t().fromRegion, false, '<a href="#adria">ExpoBalkan Adria →</a>');
      html += edGridHTML(["adria", "bih", "srb", "mne", "mkd"].filter(function (x) { return x !== ed; }), t().otherEds);
    }
    return html;
  }

  function secView(route) {
    var e = ED[route.ed], s = SEC[route.sec];
    var list = byEd(route.ed).filter(function (a) { return a.sec === route.sec; });
    var head = '<header style="display:grid;gap:10px"><span class="kicker">ExpoBalkan ' + esc(L(e)) + '</span><h1 class="h1">' + esc(L(s)) + "</h1></header>";
    var body = list.length ? '<div class="grid">' + list.map(function (a) { return card(a, route.ed === "adria"); }).join("") + "</div>"
      : '<p class="dek">' + esc(t().empty) + ' <a href="#' + e.id + '" style="text-decoration:underline">' + esc(t().back) + "</a></p>";
    return head + body;
  }

  function artView(route) {
    var a = route.art, e = ED[a.ed];
    var rel = byEd(a.ed).filter(function (x) { return x.id !== a.id; }).slice(0, 3);
    return '<article class="article">' +
      '<nav class="crumbs" aria-label="Breadcrumb"><a href="#' + e.id + '">ExpoBalkan ' + esc(L(e)) + '</a><span>/</span><a href="#' + e.id + "-" + a.sec + '">' + esc(L(SEC[a.sec])) + "</a></nav>" +
      kicker(a) + '<h1 class="h1">' + esc(L(a).t) + '</h1><p class="dek">' + esc(L(a).d) + "</p>" + meta(a) +
      '<div class="cover">' + cover(a, { w: 1400, credit: true }) + "</div>" +
      '<div class="body"><p>' + esc(L(a).d) + "</p><p>" + esc(t().body2) + "</p><p><strong>" + esc(t().keyFig) + ":</strong> " + esc(a.fig.v) + " — " + esc(L(a.fig)) + ".</p><p>" + esc(t().body3) + "</p></div>" +
      '<p class="note">' + esc(t().proto) + "</p></article>" +
      gridHTML(rel, t().related, false);
  }

  function reads(a) { var r = rng(a.id + "r"); return Math.round(1200 + r() * 9000 + (a.featured ? 6000 : 0)); }
  function thumb(a) { return '<span class="cover row__img">' + cover(a) + "</span>"; }

  function listHead(route, title) {
    return '<header class="pagehead"><span class="kicker">ExpoBalkan ' + esc(L(ED[route.ed])) + '</span><h1 class="h1">' + esc(title) + "</h1></header>";
  }

  function popularView(route) {
    var list = byEd(route.ed).slice().sort(function (a, b) { return reads(b) - reads(a); }).slice(0, 10);
    var withEd = route.ed === "adria";
    return listHead(route, t().mostRead) + '<ol class="rows">' + list.map(function (a, i) {
      return '<li><a class="row" href="#story-' + a.id + '"><span class="row__rank num">' + (i + 1) + '</span><span class="row__text">' + kicker(a, withEd) +
        '<span class="h2">' + esc(L(a).t) + '</span><span class="dek dek--sm">' + esc(L(a).d) + '</span><span class="meta"><span class="num">' + reads(a).toLocaleString(lang === "me" ? "de-DE" : "en-GB") + " " + esc(t().reads) + "</span></span></span>" + thumb(a) + "</a></li>";
    }).join("") + "</ol>";
  }

  function latestView(route) {
    var withEd = route.ed === "adria";
    return listHead(route, t().allLatest) + '<ol class="rows">' + byEd(route.ed).map(function (a) {
      return '<li><a class="row" href="#story-' + a.id + '"><time class="row__rank row__time num">' + clock(a.mins) + '</time><span class="row__text">' + kicker(a, withEd) +
        '<span class="h2">' + esc(L(a).t) + '</span><span class="dek dek--sm">' + esc(L(a).d) + "</span>" + meta(a) + "</span>" + thumb(a) + "</a></li>";
    }).join("") + "</ol>";
  }

  function subscribeView(route) {
    return listHead(route, t().subTitle) + '<p class="dek">' + esc(t().subText) + '</p><div class="plans">' + t().plans.map(function (p, i) {
      return '<form class="plan' + (i ? " plan--hi" : "") + '" data-plan><h2 class="h2">' + esc(p[0]) + '</h2><p class="plan__price num">' + esc(p[1]) + " <small>" + esc(t().perMonth) + '</small></p><p class="dek dek--sm">' + esc(p[2]) + "</p>" +
        '<label class="vh" for="plan-email-' + i + '">' + esc(t().nlPh) + '</label><input id="plan-email-' + i + '" type="email" required placeholder="' + esc(t().nlPh) + '"><button class="btn btn--solid" type="submit">' + esc(t().choose) + '</button><p class="ok" hidden>' + esc(t().subOk) + "</p></form>";
    }).join("") + '</div><p class="meta">' + esc(t().samplePrices) + "</p>";
  }

  /* ---------- search ---------- */
  function runSearch(q) {
    var res = document.getElementById("search-res"); if (!res) return;
    q = q.trim().toLowerCase();
    if (!q) { res.innerHTML = ""; return; }
    var hits = D.articles.filter(function (a) { return (L(a).t + " " + L(a).d + " " + L(ED[a.ed]) + " " + L(SEC[a.sec])).toLowerCase().indexOf(q) > -1; }).slice(0, 8);
    res.innerHTML = hits.length ? hits.map(function (a) {
      return '<li><a href="#story-' + a.id + '"><span class="kicker">' + esc(L(SEC[a.sec])) + " · " + ED[a.ed].code + '</span><span class="h3">' + esc(L(a).t) + "</span></a></li>";
    }).join("") : '<li class="meta">' + esc(t().noResults) + " “" + esc(q) + "”</li>";
  }
  function toggleSearch(open) {
    var bar = document.getElementById("searchbar"), btn = document.getElementById("search-btn");
    if (!bar) return;
    bar.hidden = !open; btn.setAttribute("aria-expanded", String(open));
    if (open) document.getElementById("search-q").focus();
  }

  /* ---------- carousel ---------- */
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function carousel() {
    var root = document.getElementById("carousel"); if (!root) return;
    var slides = root.querySelectorAll(".slide"), btns = root.querySelectorAll(".car-ctrl button"), n = slides.length, cur = 0, paused = false;
    function go(i) {
      i = (i + n) % n;
      slides[cur].hidden = true; slides[i].hidden = false;
      btns.forEach(function (b, k) { if (k === i) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current"); });
      cur = i;
    }
    btns.forEach(function (b) { b.addEventListener("click", function () { go(+b.dataset.go); }); });
    root.querySelectorAll("[data-step]").forEach(function (b) { b.addEventListener("click", function () { go(cur + +b.dataset.step); }); });
    root.addEventListener("keydown", function (ev) { if (ev.key === "ArrowRight") go(cur + 1); if (ev.key === "ArrowLeft") go(cur - 1); });
    root.addEventListener("mouseenter", function () { paused = true; }); root.addEventListener("mouseleave", function () { paused = false; });
    root.addEventListener("focusin", function () { paused = true; }); root.addEventListener("focusout", function () { paused = false; });
    clearInterval(timer);
    if (!reduced) timer = setInterval(function () { if (!paused && !document.hidden && document.getElementById("carousel") === root) go(cur + 1); }, 7000);
  }
  var timer = null;

  /* Drop any photo that can't load so the graphic cover shows through. */
  function wirePhotos() {
    document.querySelectorAll(".ph img").forEach(function (img) {
      var drop = function () { var w = img.parentNode; if (w && w.parentNode) w.parentNode.removeChild(w); };
      if (img.complete && !img.naturalWidth) drop(); else img.addEventListener("error", drop);
    });
  }

  /* ---------- drawer behaviour ---------- */
  var lastFocus = null;
  function openDrawer() { lastFocus = document.activeElement; document.body.classList.add("drawer-open"); document.getElementById("burger").setAttribute("aria-expanded", "true"); document.getElementById("drawer").removeAttribute("inert"); var c = document.getElementById("drawer-close"); if (c) c.focus(); }
  function closeDrawer() { document.body.classList.remove("drawer-open"); var b = document.getElementById("burger"); if (b) b.setAttribute("aria-expanded", "false"); document.getElementById("drawer").setAttribute("inert", ""); if (lastFocus && lastFocus.focus) lastFocus.focus(); }

  /* ---------- render ---------- */
  function render(scroll) {
    var route = parse();
    document.documentElement.setAttribute("data-ed", route.ed);
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.lang = lang === "me" ? "cnr" : "en";
    var e = ED[route.ed];
    document.title = route.view === "art" ? L(route.art).t + " · ExpoBalkan" : "ExpoBalkan " + L(e);
    chrome(route);
    var main = document.getElementById("main");
    main.innerHTML = route.view === "art" ? artView(route) : route.view === "sec" ? secView(route) : route.view === "popular" ? popularView(route) :
      route.view === "latest" ? latestView(route) : route.view === "subscribe" ? subscribeView(route) : homeView(route);
    document.getElementById("newsletter").innerHTML = nlHTML();
    carousel();
    wirePhotos();
    closeDrawer();
    if (scroll) window.scrollTo(0, 0);
  }

  document.addEventListener("click", function (ev) {
    var l = ev.target.closest("[data-lang]");
    var th = ev.target.closest("[data-theme-set]");
    if (th) { theme = th.dataset.themeSet; try { localStorage.setItem("eb-theme", theme); } catch (e) {} render(false); return; }
    if (l) { lang = l.dataset.lang; try { localStorage.setItem("eb-lang", lang); } catch (e) {} render(false); return; }
    if (ev.target.closest("#burger")) { openDrawer(); return; }
    if (ev.target.closest("#drawer-close") || ev.target.closest("#scrim")) { closeDrawer(); return; }
    if (ev.target.closest("#search-btn")) { var sb = document.getElementById("searchbar"); toggleSearch(sb.hidden); return; }
    var s = ev.target.closest("[data-nl]");
    if (s) { var nl = document.getElementById("newsletter"); if (nl) { ev.preventDefault(); nl.scrollIntoView({ behavior: reduced ? "auto" : "smooth" }); var i = document.getElementById("nl-email"); if (i) i.focus({ preventScroll: true }); } }
  });
  document.addEventListener("input", function (ev) { if (ev.target.id === "search-q") runSearch(ev.target.value); });
  document.addEventListener("submit", function (ev) {
    if (ev.target.hasAttribute("data-plan")) { ev.preventDefault(); ev.target.querySelector(".ok").hidden = false; ev.target.querySelector("button").disabled = true; return; }
    if (ev.target.id === "nl-form") { ev.preventDefault(); ev.target.hidden = true; document.getElementById("nl-ok").hidden = false; }
  });
  document.addEventListener("keydown", function (ev) { if (ev.key === "Escape") { if (document.body.classList.contains("drawer-open")) closeDrawer(); toggleSearch(false); } });
  window.addEventListener("hashchange", function () { render(true); });
  render(false);
})();
