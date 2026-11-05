const $ = (id) => document.getElementById(id);
let mode = "month";
const selected = new Set();
const weekdays = ["dom.", "seg.", "ter.", "qua.", "qui.", "sex.", "sáb."];
const iso = (d) => d.toISOString().slice(0, 10);
const parse = (s) => new Date(s + "T12:00:00Z");
const format = (s) => s.split("-").reverse().join("/");
const esc = (s) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
function datesBetween(a, b) {
  let out = [];
  for (
    let d = parse(a), end = parse(b);
    d <= end;
    d.setUTCDate(d.getUTCDate() + 1)
  ) {
    out.push(iso(d));
    if (out.length > 366) throw Error("Escolha um intervalo de até 366 dias.");
  }
  return out;
}
function getDates() {
  let dates;
  if (mode === "month") {
    if (!$("month").value) throw Error("Escolha o mês e o ano.");
    let [y, m] = $("month").value.split("-").map(Number);
    dates = datesBetween(
      $("month").value + "-01",
      iso(new Date(Date.UTC(y, m, 0, 12))),
    );
  } else if (mode === "range") {
    if (!$("start").value || !$("end").value)
      throw Error("Preencha as duas datas.");
    if ($("start").value > $("end").value)
      throw Error("A data final deve ser igual ou posterior à inicial.");
    dates = datesBetween($("start").value, $("end").value);
  } else dates = [...selected].sort();
  if ($("weekends").value === "exclude")
    dates = dates.filter((s) => ![0, 6].includes(parse(s).getUTCDay()));
  return dates;
}
function calendar() {
  const ym = $("calendarMonth").value;
  if (!ym) {
    $("calendar").innerHTML = "";
    return;
  }
  const [y, m] = ym.split("-").map(Number),
    first = new Date(Date.UTC(y, m - 1, 1, 12)).getUTCDay(),
    last = new Date(Date.UTC(y, m, 0, 12)).getUTCDate();
  $("calendar").innerHTML =
    ["D", "S", "T", "Q", "Q", "S", "S"]
      .map((x) => "<span>" + x + "</span>")
      .join("") +
    "<i></i>".repeat(first) +
    Array.from({ length: last }, (_, i) => {
      let s = ym + "-" + String(i + 1).padStart(2, "0");
      return `<button type="button" data-date="${s}" class="${selected.has(s) ? "selected" : ""}" aria-pressed="${selected.has(s)}" aria-label="${format(s)}">${i + 1}</button>`;
    }).join("");
  $("selectedCount").textContent =
    selected.size + " data(s) selecionada(s), incluindo outros meses.";
}
function render() {
  let dates = [];
  $("error").textContent = "";
  try {
    dates = getDates();
  } catch (e) {
    $("error").textContent = e.message;
  }
  $("print").disabled = !dates.length;
  let pages = Math.ceil(dates.length / 31);
  $("summary").textContent =
    dates.length + " dias · " + pages + " página" + (pages === 1 ? "" : "s");
  if (!dates.length) {
    $("preview").innerHTML =
      '<div class="paper empty">Selecione as datas para visualizar sua folha.</div>';
    return;
  }
  let period =
    mode === "month"
      ? parse(dates[0]).toLocaleDateString("pt-BR", {
          month: "long",
          year: "numeric",
          timeZone: "UTC",
        })
      : format(dates[0]) + " a " + format(dates.at(-1));
  $("preview").innerHTML = Array.from(
    { length: pages },
    (_, p) =>
      `<article class="paper"><div class="print-stamp"></div><h3>FOLHA DE FREQUÊNCIA</h3><div class="period">${period}${mode === "custom" ? " · Datas selecionadas" : ""}</div><div class="identity"><span class="name">NOME: ${esc($("name").value)}</span><span>CARGA HORÁRIA: ${$("hours").value || "____:____"}</span></div><table><thead><tr>${["Data", "Hora inicial", "Almoço", "Retorno", "Hora de saída", "Horas trab.", "Horas extras"].map((t) => "<th>" + t + "</th>").join("")}</tr></thead><tbody>${dates
        .slice(p * 31, p * 31 + 31)
        .map((s) => {
          let d = parse(s).getUTCDay();
          return `<tr class="${[0, 6].includes(d) && $("weekends").value === "highlight" ? "weekend" : ""}"><td>${format(s)}${$("dayNames").checked ? ` <span class="weekday">${weekdays[d]}</span>` : ""}</td>${"<td></td>".repeat(6)}</tr>`;
        })
        .join(
          "",
        )}</tbody></table>${$("signature").checked ? '<div class="signatures"><div>Assinatura do motorista</div><div>Responsável pela conferência</div></div>' : ""}<div class="page-no">${p + 1} / ${pages}</div></article>`,
  ).join("");
}
document.querySelectorAll("[data-mode]").forEach(
  (b) =>
    (b.onclick = () => {
      mode = b.dataset.mode;
      document.querySelectorAll("[data-mode]").forEach((x) => {
        x.classList.toggle("active", x === b);
        x.setAttribute("aria-pressed", x === b);
      });
      $("monthBox").hidden = mode !== "month";
      $("rangeBox").hidden = mode !== "range";
      $("customBox").hidden = mode !== "custom";
      calendar();
      render();
    }),
);
document.querySelectorAll("input,select").forEach((e) =>
  e.addEventListener("input", () => {
    if (e.id === "calendarMonth") calendar();
    render();
  }),
);
$("calendar").onclick = (e) => {
  let s = e.target.dataset.date;
  if (s) {
    selected.has(s) ? selected.delete(s) : selected.add(s);
    calendar();
    render();
  }
};
$("clear").onclick = () => {
  selected.clear();
  calendar();
  render();
};
function stamp() {
  document
    .querySelectorAll(".print-stamp")
    .forEach(
      (e) =>
        (e.textContent = new Date().toLocaleString("pt-BR", {
          dateStyle: "short",
          timeStyle: "short",
        })),
    );
}
window.addEventListener("beforeprint", stamp);
$("print").onclick = () => {
  stamp();
  window.print();
};
calendar();
render();
