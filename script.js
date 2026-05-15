(function () {
  const dataPath = "hotel_bookings.csv";
  const cssVars = getComputedStyle(document.documentElement);
  const COLOR_CANCEL = cssVars.getPropertyValue("--cancel").trim() || "#1f4e8a";
  const COLOR_SUCCESS =
    cssVars.getPropertyValue("--success").trim() || "#7bd3e6";
  const COLOR_PRIMARY =
    cssVars.getPropertyValue("--primary").trim() || "#0b4f9e";

  // shared tooltip
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  d3.csv(dataPath)
    .then((raw) => {
      const data = raw.map((d) => ({
        hotel: d.hotel,
        is_canceled: +d.is_canceled,
        lead_time: +d.lead_time,
        is_repeated_guest: +d.is_repeated_guest,
        total_of_special_requests: +d.total_of_special_requests,
      }));

      drawDonut(data);
      drawBarByHotelType(data);
      drawLeadTimeLine(data);
      drawCommitmentBar(data);
    })
    .catch((err) => {
      console.error("Error carregant CSV:", err);
    });

  function drawDonut(data) {
    const width = 420,
      height = 420,
      radius = Math.min(width, height) / 2 - 20;
    const wrapper = d3.select("#chart-donut");
    const svg = wrapper
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", `translate(${radius + 8},${height / 2})`);

    const counts = d3.rollup(
      data,
      (v) => v.length,
      (d) => d.is_canceled,
    );
    const total = data.length;
    const dataset = [
      {
        key: "No cancel·lades",
        value: counts.get(0) || 0,
        color: COLOR_SUCCESS,
      },
      { key: "Cancel·lades", value: counts.get(1) || 0, color: COLOR_CANCEL },
    ];

    const pie = d3.pie().value((d) => d.value)(dataset);
    const arc = d3
      .arc()
      .innerRadius(radius * 0.55)
      .outerRadius(radius);

    svg
      .selectAll("path")
      .data(pie)
      .join("path")
      .attr("d", arc)
      .attr("fill", (d) => d.data.color)
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .on("mousemove", function (event, d) {
        const percent = ((d.data.value / total) * 100).toFixed(1);
        tooltip
          .style("opacity", 1)
          .html(
            `<strong>${d.data.key}</strong><div>${d.data.value} reserves · ${percent}%</div>`,
          )
          .style("left", event.pageX + 12 + "px")
          .style("top", event.pageY + 12 + "px");
      })
      .on("mouseleave", function () {
        tooltip.style("opacity", 0);
      });

    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "-6")
      .style("font-size", "20px")
      .text(`${Math.round(((counts.get(1) || 0) / total) * 100)}%`);

    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "18")
      .style("fill", "#666")
      .text("cancel·lacions");

    const legend = wrapper
      .append("div")
      .attr("class", "legend legend-vertical");
    dataset.forEach((d) => {
      const item = legend.append("div").attr("class", "legend-item");
      item
        .append("span")
        .attr("class", "legend-swatch")
        .style("background", d.color);
      item.append("span").text(`${d.key} — ${d.value}`);
    });

    const captionEl = document.getElementById("caption-donut");
    if (captionEl) {
      const canceled = dataset.find((d) => d.key === "Cancel·lades").value;
      const completed = dataset.find((d) => d.key === "No cancel·lades").value;
      captionEl.innerHTML = `<strong>${canceled.toLocaleString()} cancel·lacions</strong> de ${total.toLocaleString()} reserves (${Math.round((canceled / total) * 100)}%). Mostra la mida del problema i la base de dades disponible per a anàlisis més fines.`;
    }
  }

  function drawBarByHotelType(data) {
    const grouped = d3.rollup(
      data,
      (v) => ({
        total: v.length,
        canceled: d3.sum(v, (d) => d.is_canceled),
      }),
      (d) => d.hotel,
    );

    const arr = Array.from(grouped, ([key, val]) => ({
      hotel: key,
      rate: (val.canceled / val.total) * 100,
      total: val.total,
    }));

    const margin = { top: 20, right: 20, bottom: 40, left: 40 },
      w = 600,
      mh = 420;
    const svg = d3
      .select("#chart-bar-type")
      .append("svg")
      .attr("viewBox", `0 0 ${w} ${mh}`);
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    const width = w - margin.left - margin.right,
      height = mh - margin.top - margin.bottom;

    const y = d3
      .scaleBand()
      .domain(arr.map((d) => d.hotel))
      .range([0, height])
      .padding(0.3);
    const x = d3
      .scaleLinear()
      .domain([0, d3.max(arr, (d) => d.rate)])
      .nice()
      .range([0, width]);

    g.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-weight", 600);
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(5)
          .tickFormat((d) => d + "%"),
      );

    d3.select("#chart-bar-type")
      .append("div")
      .attr("class", "chart-axis-label-bottom")
      .style("text-align", "center")
      .text("Tipus d'hotel");

    d3.select("#chart-bar-type")
      .append("div")
      .attr("class", "chart-axis-label-left")
      .text("Taxa de cancel·lació (%)")
      .style("transform", "rotate(-90deg)")
      .style("transform-origin", "left bottom");

    g.selectAll(".bar")
      .data(arr)
      .join("rect")
      .attr("class", "bar")
      .attr("y", (d) => y(d.hotel))
      .attr("height", y.bandwidth())
      .attr("x", 0)
      .attr("width", (d) => x(d.rate))
      .attr("fill", COLOR_PRIMARY)
      .on("mousemove", function (event, d) {
        tooltip
          .style("opacity", 1)
          .html(
            `<strong>${d.hotel}</strong><div>${d.total} reserves · ${d.rate.toFixed(1)}%</div>`,
          )
          .style("left", event.pageX + 12 + "px")
          .style("top", event.pageY + 12 + "px");
      })
      .on("mouseleave", () => tooltip.style("opacity", 0));

    g.selectAll(".bar-label")
      .data(arr)
      .join("text")
      .attr("class", "bar-label")
      .attr("x", (d) => x(d.rate) + 8)
      .attr("y", (d) => y(d.hotel) + y.bandwidth() / 2 + 5)
      .text((d) => `${d.rate.toFixed(1)}%`);

    const captionBar = document.getElementById("caption-bar-type");
    if (captionBar) {
      const totalAll = d3.sum(arr, (d) => d.total);
      const top = arr.slice().sort((a, b) => b.rate - a.rate)[0];
      captionBar.innerHTML = `<strong>N = ${totalAll.toLocaleString()} reserves</strong>. Tipus amb més cancel·lacions: <strong>${top.hotel}</strong> — ${top.rate.toFixed(1)}% (${top.total} reserves).`;
    }
  }

  function drawLeadTimeLine(data) {
    const buckets = [
      { k: "0-30", min: 0, max: 30 },
      { k: "31-90", min: 31, max: 90 },
      { k: "91-180", min: 91, max: 180 },
      { k: "180+", min: 181, max: 100000 },
    ];
    const stats = buckets.map((b) => {
      const v = data.filter(
        (d) => d.lead_time >= b.min && d.lead_time <= b.max,
      );
      return {
        bucket: b.k,
        rate: v.length ? (d3.sum(v, (d) => d.is_canceled) / v.length) * 100 : 0,
        count: v.length,
      };
    });

    const w = 640,
      h = 420,
      margin = { top: 20, right: 20, bottom: 40, left: 20 };
    const svg = d3
      .select("#chart-leadtime")
      .append("svg")
      .attr("viewBox", `0 0 ${w} ${h}`);
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    const width = w - margin.left - margin.right,
      height = h - margin.top - margin.bottom;

    const x = d3
      .scalePoint()
      .domain(stats.map((d) => d.bucket))
      .range([0, width])
      .padding(0.5);
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(stats, (d) => d.rate)])
      .nice()
      .range([height, 0]);

    const line = d3
      .line()
      .x((d) => x(d.bucket))
      .y((d) => y(d.rate))
      .curve(d3.curveMonotoneX);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat((d) => `${d} dies`))
      .selectAll("text")
      .style("text-anchor", "middle")
      .attr("dy", "1.1em");

    d3.select("#chart-leadtime")
      .append("div")
      .attr("class", "chart-axis-label-bottom")
      .style("text-align", "center")
      .text("Franja de temps (dies)");

    d3.select("#chart-leadtime")
      .append("div")
      .attr("class", "chart-axis-label-left")
      .text("Taxa de cancel·lació (%)")
      .style("transform", "rotate(-90deg)")
      .style("transform-origin", "left bottom");

    g.append("g").call(
      d3
        .axisLeft(y)
        .ticks(5)
        .tickFormat((d) => d + "%"),
    );

    // gridlines
    g.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(y).tickSize(-width).tickFormat("").ticks(5));

    g.append("path")
      .datum(stats)
      .attr("fill", "none")
      .attr("stroke", COLOR_CANCEL)
      .attr("stroke-width", 3)
      .attr("d", line);
    g.selectAll("circle")
      .data(stats)
      .join("circle")
      .attr("cx", (d) => x(d.bucket))
      .attr("cy", (d) => y(d.rate))
      .attr("r", 6)
      .attr("fill", COLOR_CANCEL)
      .on("mousemove", function (event, d) {
        tooltip
          .style("opacity", 1)
          .html(
            `<strong>${d.bucket} dies</strong><div>${d.count} reserves · ${d.rate.toFixed(1)}%</div>`,
          )
          .style("left", event.pageX + 12 + "px")
          .style("top", event.pageY + 12 + "px");
      })
      .on("mouseleave", () => tooltip.style("opacity", 0));

    const captionLead = document.getElementById("caption-leadtime");
    if (captionLead) {
      const totalLead = d3.sum(stats, (d) => d.count);
      const top = stats.slice().sort((a, b) => b.rate - a.rate)[0];
      captionLead.innerHTML = `<strong>N = ${totalLead.toLocaleString()} reserves</strong>. Màxima taxa per franja: <strong>${top.bucket}</strong> — ${top.rate.toFixed(1)}% (${top.count} reserves).`;
    }
  }

  function drawCommitmentBar(data) {
    const grouped = d3.rollup(
      data,
      (v) => ({ total: v.length, canceled: d3.sum(v, (d) => d.is_canceled) }),
      (d) => d.is_repeated_guest,
    );
    const arr = Array.from(grouped, ([k, v]) => ({
      label: k == 1 ? "Repetidor" : "Primera vegada",
      rate: (v.canceled / v.total) * 100,
      total: v.total,
    }));

    const w = 600,
      h = 360,
      margin = { top: 20, right: 20, bottom: 40, left: 32 };
    const svg = d3
      .select("#chart-commitment")
      .append("svg")
      .attr("viewBox", `0 0 ${w} ${h}`);
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    const width = w - margin.left - margin.right,
      height = h - margin.top - margin.bottom;

    const x = d3
      .scaleBand()
      .domain(arr.map((d) => d.label))
      .range([0, width])
      .padding(0.4);
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(arr, (d) => d.rate)])
      .nice()
      .range([height, 0]);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    d3.select("#chart-commitment")
      .append("div")
      .attr("class", "chart-axis-label-bottom")
      .style("text-align", "center")
      .text("Tipus de client");

    d3.select("#chart-commitment")
      .append("div")
      .attr("class", "chart-axis-label-left")
      .text("Taxa de cancel·lació (%)")
      .style("transform", "rotate(-90deg)")
      .style("transform-origin", "left bottom");

    g.append("g").call(
      d3
        .axisLeft(y)
        .ticks(5)
        .tickFormat((d) => d + "%"),
    );

    g.selectAll("rect")
      .data(arr)
      .join("rect")
      .attr("x", (d) => x(d.label))
      .attr("y", (d) => y(d.rate))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.rate))
      .attr("fill", COLOR_SUCCESS)
      .on("mousemove", function (event, d) {
        tooltip
          .style("opacity", 1)
          .html(
            `<strong>${d.label}</strong><div>${d.total} reserves · ${d.rate.toFixed(1)}%</div>`,
          )
          .style("left", event.pageX + 12 + "px")
          .style("top", event.pageY + 12 + "px");
      })
      .on("mouseleave", () => tooltip.style("opacity", 0));

    g.selectAll(".bar-label-commit")
      .data(arr)
      .join("text")
      .attr("class", "bar-label")
      .attr("x", (d) => x(d.label) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.rate) - 8)
      .attr("text-anchor", "middle")
      .text((d) => `${d.rate.toFixed(1)}%`);

    const captionCommit = document.getElementById("caption-commitment");
    if (captionCommit) {
      const totalCommit = d3.sum(arr, (d) => d.total);
      const first = arr.find((d) => d.label === "Primera vegada");
      const repeat = arr.find((d) => d.label === "Repetidor");
      const diff =
        first && repeat ? (first.rate - repeat.rate).toFixed(1) : "—";
      captionCommit.innerHTML = `<strong>N = ${totalCommit.toLocaleString()} reserves</strong>. Diferència entre primera vegada i repetidors: <strong>${diff} p.p.</strong> (primera vegada ${first ? first.rate.toFixed(1) : "—"}%, repetidor ${repeat ? repeat.rate.toFixed(1) : "—"}%).`;
    }
  }
})();

(function () {
  const panels = Array.from(document.querySelectorAll(".panel"));
  if (!panels.length) return;

  function getCurrentPanelIndex() {
    const scrollY = window.scrollY || window.pageYOffset;
    let current = 0;
    for (let i = 0; i < panels.length; i++) {
      const elTop = panels[i].offsetTop;
      if (elTop <= scrollY + 10) current = i;
    }
    return current;
  }

  function goToIndex(i) {
    const idx = Math.max(0, Math.min(panels.length - 1, i));
    panels[idx].scrollIntoView({ behavior: "smooth" });
  }

  window.addEventListener("keydown", (e) => {
    const tag =
      (document.activeElement && document.activeElement.tagName) || "";
    if (
      tag === "INPUT" ||
      tag === "TEXTAREA" ||
      document.activeElement.isContentEditable
    )
      return;

    if (e.key === "ArrowRight") {
      e.preventDefault();
      const cur = getCurrentPanelIndex();
      if (cur < panels.length - 1) goToIndex(cur + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const cur = getCurrentPanelIndex();
      if (cur > 0) goToIndex(cur - 1);
    }
  });
})();
