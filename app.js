(function () {
  "use strict";

  const CONFIG = window.CALENDAR_CONFIG;
  const FALLBACK_EVENTS = [
    { id: "c6704-w1", date: "2026-09-01", title: "COMP6704", start: "18:30", end: "21:30", category: "comp6704", details: "Advanced Topics in Optimization · Week 1" },
    { id: "c6001-w1", date: "2026-09-05", title: "CMS6001", start: "09:30", end: "17:00", category: "cms6001", details: "Advanced AI Programming · Week 1 · 午休 12:30–14:00" },
    { id: "c6002-w1", date: "2026-09-06", title: "CMS6002", start: "09:30", end: "17:00", category: "cms6002", details: "Frontiers of Artificial Intelligence · Week 1 · 午休 12:30–14:00" },
    { id: "c6704-w2", date: "2026-09-08", title: "COMP6704", start: "18:30", end: "21:30", category: "comp6704", details: "Advanced Topics in Optimization · Week 2" },
    { id: "c6704-w3", date: "2026-09-15", title: "COMP6704", start: "18:30", end: "21:30", category: "comp6704", details: "Advanced Topics in Optimization · Week 3" },
    { id: "c6001-w3", date: "2026-09-19", title: "CMS6001", start: "09:30", end: "17:00", category: "cms6001", details: "Advanced AI Programming · Week 3 · 午休 12:30–14:00" },
    { id: "c6002-w3", date: "2026-09-20", title: "CMS6002", start: "09:30", end: "17:00", category: "cms6002", details: "Frontiers of Artificial Intelligence · Week 3 · 午休 12:30–14:00" },
    { id: "c6704-w4", date: "2026-09-22", title: "COMP6704", start: "18:30", end: "21:30", category: "comp6704", details: "Advanced Topics in Optimization · Week 4" },
    { id: "holiday-w4", date: "2026-09-25", title: "中秋节", start: "", end: "", category: "personal", details: "Week 4 · 周末课程暂停" },
    { id: "c6704-w5", date: "2026-09-29", title: "COMP6704", start: "18:30", end: "21:30", category: "comp6704", details: "Advanced Topics in Optimization · Week 5" },
    { id: "c6704-w6", date: "2026-10-06", title: "COMP6704", start: "18:30", end: "21:30", category: "comp6704", details: "Advanced Topics in Optimization · Week 6" },
    { id: "c6001-w6", date: "2026-10-10", title: "CMS6001", start: "09:30", end: "17:00", category: "cms6001", details: "Advanced AI Programming · Week 6 · 午休 12:30–14:00" },
    { id: "c6002-w6", date: "2026-10-11", title: "CMS6002", start: "09:30", end: "17:00", category: "cms6002", details: "Frontiers of Artificial Intelligence · Week 6 · 午休 12:30–14:00" },
    { id: "c6704-w7", date: "2026-10-13", title: "COMP6704", start: "18:30", end: "21:30", category: "comp6704", details: "Advanced Topics in Optimization · Week 7" },
    { id: "c6704-w8", date: "2026-10-20", title: "COMP6704", start: "18:30", end: "21:30", category: "comp6704", details: "Advanced Topics in Optimization · Week 8" },
    { id: "c6704-w9", date: "2026-10-27", title: "COMP6704", start: "18:30", end: "21:30", category: "comp6704", details: "Advanced Topics in Optimization · Week 9" },
    { id: "c6001-w9", date: "2026-10-31", title: "CMS6001", start: "09:30", end: "17:00", category: "cms6001", details: "Advanced AI Programming · Week 9 · 午休 12:30–14:00" },
    { id: "c6002-w9", date: "2026-11-01", title: "CMS6002", start: "09:30", end: "17:00", category: "cms6002", details: "Frontiers of Artificial Intelligence · Week 9 · 午休 12:30–14:00" },
    { id: "c6704-w10", date: "2026-11-03", title: "COMP6704", start: "18:30", end: "21:30", category: "comp6704", details: "Advanced Topics in Optimization · Week 10" },
    { id: "c6704-w11", date: "2026-11-10", title: "COMP6704", start: "18:30", end: "21:30", category: "comp6704", details: "Advanced Topics in Optimization · Week 11" },
    { id: "c6704-w12", date: "2026-11-17", title: "COMP6704", start: "18:30", end: "21:30", category: "comp6704", details: "Advanced Topics in Optimization · Week 12" },
    { id: "c6001-w12", date: "2026-11-21", title: "CMS6001", start: "09:30", end: "17:00", category: "cms6001", details: "Advanced AI Programming · Week 12 · 午休 12:30–14:00" },
    { id: "c6002-w12", date: "2026-11-22", title: "CMS6002", start: "09:30", end: "17:00", category: "cms6002", details: "Frontiers of Artificial Intelligence · Week 12 · 午休 12:30–14:00" },
    { id: "c6704-w13", date: "2026-11-24", title: "COMP6704", start: "18:30", end: "21:30", category: "comp6704", details: "Advanced Topics in Optimization · Week 13" }
  ];

  const zhWeek = ["日", "一", "二", "三", "四", "五", "六"];
  let events = FALLBACK_EVENTS;
  let shownMonth = 8;
  let shownYear = 2026;

  const el = (id) => document.getElementById(id);
  const iso = (date) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
  const monthName = () => `${shownYear}年 ${shownMonth + 1}月`;
  const teachingWeek = (dateString) => {
    const day = new Date(`${dateString}T12:00:00`);
    const start = new Date("2026-08-31T12:00:00");
    const week = Math.floor((day - start) / 604800000) + 1;
    return week >= 1 && week <= 13 ? `W${week}` : "";
  };

  function render() {
    el("monthTitle").textContent = monthName();
    renderMonth();
    renderAgenda();
  }

  function renderMonth() {
    const grid = el("calendarGrid");
    grid.replaceChildren();
    const first = new Date(shownYear, shownMonth, 1);
    const offset = (first.getDay() + 6) % 7;
    const start = new Date(shownYear, shownMonth, 1 - offset);

    for (let i = 0; i < 42; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      const dateString = iso(day);
      const cell = document.createElement("div");
      cell.className = `day${day.getMonth() !== shownMonth ? " other-month" : ""}`;
      const dateNumber = document.createElement("span");
      dateNumber.className = "day-number";
      dateNumber.textContent = day.getDate();
      cell.append(dateNumber);
      const week = teachingWeek(dateString);
      if (week && day.getDay() === 1) {
        const badge = document.createElement("span");
        badge.className = "week-label";
        badge.textContent = week;
        cell.append(badge);
      }
      const stack = document.createElement("div");
      stack.className = "events";
      events.filter(e => e.date === dateString).forEach(event => stack.append(makePill(event)));
      cell.append(stack);
      grid.append(cell);
    }
  }

  function makePill(event) {
    const pill = el("eventTemplate").content.firstElementChild.cloneNode(true);
    pill.classList.add(event.category || "personal");
    pill.querySelector(".event-time").textContent = event.start || "全天";
    pill.querySelector(".event-title").textContent = event.title;
    pill.title = [event.title, event.start && `${event.start}–${event.end}`, event.details].filter(Boolean).join("\n");
    pill.addEventListener("click", () => alert(pill.title));
    return pill;
  }

  function renderAgenda() {
    const agenda = el("agendaView");
    agenda.replaceChildren();
    const monthly = events.filter(e => {
      const d = new Date(`${e.date}T12:00:00`);
      return d.getFullYear() === shownYear && d.getMonth() === shownMonth;
    }).sort((a,b) => `${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`));
    const grouped = Object.groupBy ? Object.groupBy(monthly, e => e.date) : monthly.reduce((acc,e) => ((acc[e.date] ||= []).push(e), acc), {});
    Object.entries(grouped).forEach(([dateString, dayEvents]) => {
      const date = new Date(`${dateString}T12:00:00`);
      const row = document.createElement("div");
      row.className = "agenda-day";
      row.innerHTML = `<div class="agenda-date"><strong>${date.getMonth()+1}月${date.getDate()}日</strong><span>周${zhWeek[date.getDay()]} · ${teachingWeek(dateString)}</span></div><div class="agenda-events"></div>`;
      dayEvents.forEach(event => {
        const item = document.createElement("div");
        item.className = `agenda-event ${event.category || "personal"}`;
        item.innerHTML = `<strong></strong><span></span>`;
        item.querySelector("strong").textContent = event.title;
        item.querySelector("span").textContent = `${event.start ? `${event.start}–${event.end}` : "全天"}${event.details ? ` · ${event.details}` : ""}`;
        row.querySelector(".agenda-events").append(item);
      });
      agenda.append(row);
    });
    if (!monthly.length) agenda.innerHTML = '<p style="padding:30px 0;color:#6f7788;text-align:center">本月暂无事件</p>';
  }

  async function syncEvents() {
    const status = el("syncStatus");
    const hosted = location.protocol.startsWith("http") && location.hostname.endsWith("github.io");
    const url = hosted ? `events.json?t=${Date.now()}` : `https://raw.githubusercontent.com/${CONFIG.owner}/${CONFIG.repo}/${CONFIG.branch}/events.json?t=${Date.now()}`;
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) throw new Error("not deployed");
      const remote = await response.json();
      if (!Array.isArray(remote)) throw new Error("invalid event data");
      events = remote;
      status.className = "sync-status ok";
      status.innerHTML = `<span></span> 已同步 · ${new Date().toLocaleTimeString("zh-CN", {hour:"2-digit", minute:"2-digit"})}`;
      render();
    } catch (_) {
      status.className = "sync-status error";
      status.innerHTML = "<span></span> 当前使用内置课程表；发布后将自动连接共享日历";
      render();
    }
  }

  el("prevMonth").addEventListener("click", () => { shownMonth--; if (shownMonth < 0) { shownMonth = 11; shownYear--; } render(); });
  el("nextMonth").addEventListener("click", () => { shownMonth++; if (shownMonth > 11) { shownMonth = 0; shownYear++; } render(); });
  el("monthTitle").addEventListener("click", () => { shownYear = 2026; shownMonth = 8; render(); });
  document.querySelectorAll("[data-view]").forEach(button => button.addEventListener("click", () => {
    document.querySelectorAll("[data-view]").forEach(b => b.classList.toggle("active", b === button));
    el("monthView").hidden = button.dataset.view !== "month";
    el("agendaView").hidden = button.dataset.view !== "agenda";
  }));
  el("openAdd").addEventListener("click", () => el("eventDialog").showModal());
  el("closeDialog").addEventListener("click", () => el("eventDialog").close());
  el("eventForm").addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const params = new URLSearchParams({
      template: "new-event.yml",
      title: `[日历] ${data.get("date")} ${data.get("title")}`,
      "event-title": data.get("title"),
      date: data.get("date"),
      start: data.get("start") || "全天",
      end: data.get("end") || "全天",
      category: data.get("category"),
      notes: data.get("notes") || "无"
    });
    window.open(`https://github.com/${CONFIG.owner}/${CONFIG.repo}/issues/new?${params}`, "_blank", "noopener");
    el("eventDialog").close();
  });

  render();
  syncEvents();
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js");
})();
