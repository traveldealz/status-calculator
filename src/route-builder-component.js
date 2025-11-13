import translate from "./helper/translate";

const STYLE_ID = "route-builder-styles";

const ensureStyles = () => {
  if (document.getElementById(STYLE_ID)) {
    return;
  }
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    .route-builder {
      display: block;
      margin-top: 0.25rem;
    }
    .route-builder__wrapper {
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      padding: 1rem;
      background: #fff;
    }
    .route-builder__list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .route-builder__row {
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 0.75rem;
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      position: relative;
    }
    .route-builder__meta {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      width: 100%;
    }
    .route-builder__field--airline {
      flex: 2 1 240px;
      min-width: 180px;
      max-width: 250px;
    }
    .route-builder__field--class {
      flex: 0 0 90px;
      max-width: 110px;
    }
    .route-builder__field--ticketing {
      flex: 1.4 1 220px;
      min-width: 170px;
      max-width: 250px;
    }
    .route-builder__field--price {
      flex: 0 0 150px;
      max-width: 170px;
    }
    .route-builder__field--currency {
      flex: 0 0 150px;
      max-width: 180px;
    }
    @media (min-width: 900px) {
      .route-builder__row {
        align-items: flex-start;
      }
      .route-builder__meta {
        width: auto;
        flex: 2 1 320px;
      }
    }
    .route-builder__field {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      min-width: 120px;
      flex: 1 1 120px;
    }
    .route-builder__field input {
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      padding: 0.5rem;
      font-size: 0.95rem;
      text-transform: uppercase;
    }
    .route-builder__field select {
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      padding: 0.5rem;
      font-size: 0.95rem;
      text-transform: none;
    }
    .route-builder__segments {
      flex: 1 1 100%;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      width: 100%;
    }
    .route-builder__segment-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
    }
    .route-builder__segment {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    .route-builder__segment input {
      width: 4.5rem;
      text-align: center;
    }
    .route-builder__segment button,
    .route-builder__remove,
    .route-builder__actions button {
      background: transparent;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      padding: 0.25rem 0.5rem;
      cursor: pointer;
      font-size: 0.85rem;
    }
    .route-builder__segment button:hover,
    .route-builder__remove:hover,
    .route-builder__actions button:hover {
      background: #f3f4f6;
    }
    .route-builder__add-leg {
      align-self: flex-start;
      margin-top: 0.25rem;
    }
    .route-builder__remove {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
    }
    .route-builder__actions {
      margin-top: 0.75rem;
      display: flex;
      justify-content: flex-start;
    }
  `;
  document.head.appendChild(style);
};

const DEFAULT_CURRENCY = "USD";
const CURRENCY_OPTIONS = [
  "USD",
  "EUR",
  "GBP",
  "CHF",
  "CAD",
  "AUD",
  "JPY",
  "CNY",
  "SEK",
  "NOK",
  "DKK",
  "PLN",
  "BRL",
  "INR",
];
const CURRENCY_SYMBOL_MAP = {
  $: "USD",
  "€": "EUR",
  "£": "GBP",
};

const createEmptyRoute = () => ({
  carrier: "",
  bookingClass: "",
  ticketingCarrier: "",
  price: "",
  currency: DEFAULT_CURRENCY,
  airports: ["", ""],
  extras: "",
});

const sanitizeAirline = (value) =>
  value ? value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 3) : "";

const sanitizeClass = (value) =>
  value ? value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 1) : "";

const sanitizeAirport = (value) =>
  value ? value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3) : "";

const sanitizePrice = (value) => {
  if (!value) {
    return "";
  }
  const normalized = value
    .toString()
    .replace(",", ".")
    .replace(/[^0-9.]/g, "");
  if (!normalized) {
    return "";
  }
  const [integerPart, ...decimalParts] = normalized.split(".");
  if (decimalParts.length === 0) {
    return integerPart;
  }
  return `${integerPart}.${decimalParts.join("")}`;
};

const sanitizeCurrency = (value) => {
  if (!value) {
    return "";
  }
  const symbol = CURRENCY_SYMBOL_MAP[value];
  if (symbol) {
    return symbol;
  }
  const normalized = value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3);
  return normalized;
};

const AIRLINE_ENDPOINT =
  "https://data.travel-dealz.net/api/airlines?fields[airlines]=iatacode,name&filter[has_earnings]=true";

export default class RouteBuilder extends HTMLElement {
  static get observedAttributes() {
    return ["value"];
  }

  constructor() {
    super();
    this.routes = [];
    this._pendingValue = "";
    this._initialized = false;
    this._pendingFocus = null;
    this.airlines = RouteBuilder._airlinesCache
      ? [...RouteBuilder._airlinesCache]
      : [];
    this.translations = [];
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    if ("value" === name) {
      this.value = newValue ?? "";
    }
  }

  connectedCallback() {
    if (this._initialized) {
      return;
    }
    this._initialized = true;
    ensureStyles();

    const initialValue =
      this.getAttribute("value")?.trim() ??
      (this.textContent ? this.textContent.trim() : "");

    this.textContent = "";

    this.el_wrapper = document.createElement("div");
    this.el_wrapper.className = "route-builder__wrapper";
    this.el_list = document.createElement("div");
    this.el_list.className = "route-builder__list";
    this.el_wrapper.appendChild(this.el_list);

    this.el_actions = document.createElement("div");
    this.el_actions.className = "route-builder__actions";
    const el_addRouteBtn = document.createElement("button");
    el_addRouteBtn.type = "button";
    el_addRouteBtn.textContent = this.t("Add Route");
    el_addRouteBtn.addEventListener("click", () => {
      this.routes.push(createEmptyRoute());
      this.ensureTrailingAirports(this.routes[this.routes.length - 1]);
      this.renderRoutes();
    });
    this.el_actions.appendChild(el_addRouteBtn);
    this.el_wrapper.appendChild(this.el_actions);

    this.appendChild(this.el_wrapper);

    this.value = initialValue;
    this.loadAirlines();
  }

  get name() {
    return this.getAttribute("name") ?? "";
  }

  set name(value) {
    if (value) {
      this.setAttribute("name", value);
    } else {
      this.removeAttribute("name");
    }
  }

  get value() {
    return this.serializeRoutes();
  }

  set value(rawValue) {
    this._pendingValue = rawValue ?? "";
    this.routes = this.parseValue(this._pendingValue);
    if (!this.routes.length) {
      this.routes = [createEmptyRoute()];
    }
    if (this._initialized) {
      this.renderRoutes();
    }
  }

  parseValue(value) {
    if (!value) {
      return [];
    }
    return value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split(":");
        const carrier = sanitizeAirline(parts[0] ?? "");
        const bookingClass = sanitizeClass(parts[1] ?? "");
        const routePart = parts[2] ?? "";
        const airports = routePart
          .split("-")
          .map((code) => sanitizeAirport(code ?? ""))
          .filter((code) => code.length > 0);
        while (airports.length < 2) {
          airports.push("");
        }
        const ticketingCarrier = sanitizeAirline(parts[3] ?? "");
        const priceField = parts[4] ?? "";
        const price = sanitizePrice(priceField);
        const hasExplicitCurrency =
          parts[5] && /^[A-Z]{3}$/i.test(parts[5] ?? "");
        const currencyFromSegment = hasExplicitCurrency
          ? sanitizeCurrency(parts[5])
          : "";
        let currency = currencyFromSegment;
        if (!currency) {
          const match = priceField.match(/[A-Z]{3}|[$€£]/u);
          currency = match ? sanitizeCurrency(match[0]) : "";
        }
        currency = currency || DEFAULT_CURRENCY;
        const extrasStartIndex = hasExplicitCurrency ? 6 : 5;
        const extras = parts.slice(extrasStartIndex).join(":").trim();

        const route = {
          carrier,
          bookingClass,
          ticketingCarrier,
          price,
          currency,
          airports: airports.length ? airports : ["", ""],
          extras,
        };
        this.ensureTrailingAirports(route);
        return route;
      });
  }

  renderRoutes() {
    if (!this.el_list) {
      return;
    }

    const focusData = this._pendingFocus ?? this.captureFocusState();

    this.el_list.innerHTML = "";
    this.routes.forEach((route, routeIndex) => {
      this.el_list.appendChild(this.renderRoute(route, routeIndex));
    });

    this.restoreFocusState(focusData);
    this._pendingFocus = null;

    this.syncValue();
  }

  fieldName(base, routeIndex, subIndex) {
    if (subIndex !== undefined && subIndex !== null) {
      return `${base}[${routeIndex}][${subIndex}]`;
    }
    return `${base}[${routeIndex}]`;
  }

  renderRoute(route, routeIndex) {
    const el_row = document.createElement("div");
    el_row.className = "route-builder__row";

    const el_airlineField = this.createAirlineField(route, routeIndex);
    el_airlineField.classList.add("route-builder__field--airline");

    const el_classField = this.createInputField(
      this.t("Booking Class"),
      route.bookingClass,
      (value) => {
        const next = sanitizeClass(value);
        this.routes[routeIndex].bookingClass = next;
        this.syncValue();
        return next;
      },
      {
        maxLength: 1,
        placeholder: "P",
        pattern: "[A-Za-z]",
        inputmode: "text",
        title: "__(Booking class must be A-Z)",
        name: this.fieldName("segment_booking_class", routeIndex),
      }
    );
    el_classField.classList.add("route-builder__field--class");
    const el_segmentsField = this.createSegmentsField(route, routeIndex);
    const el_ticketingField = this.createTicketingField(route, routeIndex);
    el_ticketingField.classList.add("route-builder__field--ticketing");
    const el_priceField = this.createPriceField(route, routeIndex);
    el_priceField.classList.add("route-builder__field--price");
    const el_currencyField = this.createCurrencyField(route, routeIndex);
    el_currencyField.classList.add("route-builder__field--currency");

    const el_metaWrapper = document.createElement("div");
    el_metaWrapper.className = "route-builder__meta";
    el_metaWrapper.appendChild(el_ticketingField);
    el_metaWrapper.appendChild(el_priceField);
    el_metaWrapper.appendChild(el_currencyField);

    const el_removeBtn = document.createElement("button");
    el_removeBtn.type = "button";
    el_removeBtn.className = "route-builder__remove";
    el_removeBtn.textContent = "×";
    el_removeBtn.title = this.t("Remove route");
    el_removeBtn.disabled = 1 === this.routes.length;
    el_removeBtn.addEventListener("click", () => {
      if (1 === this.routes.length) {
        return;
      }
      this.routes.splice(routeIndex, 1);
      this.renderRoutes();
    });

    el_row.appendChild(el_airlineField);
    el_row.appendChild(el_classField);
    el_row.appendChild(el_metaWrapper);
    el_row.appendChild(el_segmentsField);
    el_row.appendChild(el_removeBtn);

    return el_row;
  }

  createAirlineField(route, routeIndex) {
    const el_field = document.createElement("label");
    el_field.className = "route-builder__field";

    const el_label = document.createElement("span");
    el_label.textContent = this.t("Airline");
    el_field.appendChild(el_label);

    const el_select = document.createElement("select");
    el_select.dataset.field = "airline";
    el_select.dataset.routeIndex = `${routeIndex}`;
    el_select.disabled = 0 === this.airlines.length;
    el_select.name = this.fieldName("segment_airline", routeIndex);

    const el_placeholder = document.createElement("option");
    el_placeholder.value = "";
    el_placeholder.textContent = this.airlines.length
      ? this.t("Select airline")
      : this.t("Loading airlines…");
    el_select.appendChild(el_placeholder);

    this.airlines.forEach((airline) => {
      const el_option = document.createElement("option");
      el_option.value = airline.code;
      el_option.textContent = `${airline.code} · ${airline.name}`;
      el_select.appendChild(el_option);
    });

    if (
      route.carrier &&
      !this.airlines.some((airline) => airline.code === route.carrier)
    ) {
      const el_customOption = document.createElement("option");
      el_customOption.value = route.carrier;
      el_customOption.textContent = route.carrier;
      el_select.appendChild(el_customOption);
    }

    el_select.value = route.carrier ?? "";

    el_select.addEventListener("change", (event) => {
      const prevCarrier = this.routes[routeIndex].carrier;
      const next = sanitizeAirline(event.target.value);
      this.routes[routeIndex].carrier = next;
      if (
        !this.routes[routeIndex].ticketingCarrier ||
        this.routes[routeIndex].ticketingCarrier === prevCarrier
      ) {
        this.routes[routeIndex].ticketingCarrier = "";
      }
      this.renderRoutes();
    });

    el_field.appendChild(el_select);
    return el_field;
  }

  createTicketingField(route, routeIndex) {
    const el_field = document.createElement("label");
    el_field.className = "route-builder__field";

    const el_label = document.createElement("span");
    el_label.textContent = `${this.t("Ticketing airline")} (${this.t("optional")})`;
    el_field.appendChild(el_label);

    const el_select = document.createElement("select");
    el_select.dataset.field = "ticketing";
    el_select.dataset.routeIndex = `${routeIndex}`;
    el_select.disabled = 0 === this.airlines.length && !route.carrier;
    el_select.name = this.fieldName("segment_ticketing", routeIndex);

    const el_placeholder = document.createElement("option");
    el_placeholder.value = "";
    el_placeholder.textContent = route.carrier
      ? `${this.t("Same as airline")} (${route.carrier})`
      : this.t("Select ticketing airline");
    el_select.appendChild(el_placeholder);

    this.airlines.forEach((airline) => {
      const el_option = document.createElement("option");
      el_option.value = airline.code;
      el_option.textContent = `${airline.code} · ${airline.name}`;
      el_select.appendChild(el_option);
    });

    if (
      route.ticketingCarrier &&
      !this.airlines.some((airline) => airline.code === route.ticketingCarrier)
    ) {
      const el_customOption = document.createElement("option");
      el_customOption.value = route.ticketingCarrier;
      el_customOption.textContent = route.ticketingCarrier;
      el_select.appendChild(el_customOption);
    }

    el_select.value = route.ticketingCarrier || "";

    el_select.addEventListener("change", (event) => {
      const next = sanitizeAirline(event.target.value);
      this.routes[routeIndex].ticketingCarrier = next;
      this.syncValue();
    });

    el_field.appendChild(el_select);
    return el_field;
  }

  createPriceField(route, routeIndex) {
    const el_field = document.createElement("label");
    el_field.className = "route-builder__field";

    const el_label = document.createElement("span");
    el_label.textContent = `${this.t("Flight price")} (${this.t("optional")})`;
    el_field.appendChild(el_label);

    const el_input = document.createElement("input");
    el_input.type = "text";
    el_input.placeholder = "0.00";
    el_input.inputMode = "decimal";
    el_input.value = route.price ?? "";
    el_input.dataset.field = "price";
    el_input.dataset.routeIndex = `${routeIndex}`;
    el_input.name = this.fieldName("segment_flight_price", routeIndex);
    el_input.addEventListener("input", (event) => {
      const sanitized = sanitizePrice(event.target.value);
      this.routes[routeIndex].price = sanitized;
      event.target.value = sanitized;
      this.syncValue();
    });

    el_field.appendChild(el_input);
    return el_field;
  }

  createCurrencyField(route, routeIndex) {
    const el_field = document.createElement("label");
    el_field.className = "route-builder__field";

    const el_label = document.createElement("span");
    el_label.textContent = `${this.t("Currency")} (${this.t("optional")})`;
    el_field.appendChild(el_label);

    const el_select = document.createElement("select");
    el_select.dataset.field = "currency";
    el_select.dataset.routeIndex = `${routeIndex}`;
    el_select.name = this.fieldName("segment_currency", routeIndex);

    CURRENCY_OPTIONS.forEach((currency) => {
      const el_option = document.createElement("option");
      el_option.value = currency;
      el_option.textContent = currency;
      el_select.appendChild(el_option);
    });

    const currentCurrency = sanitizeCurrency(route.currency) || DEFAULT_CURRENCY;
    if (!CURRENCY_OPTIONS.includes(currentCurrency)) {
      const el_customOption = document.createElement("option");
      el_customOption.value = currentCurrency;
      el_customOption.textContent = currentCurrency;
      el_select.appendChild(el_customOption);
    }

    el_select.value = currentCurrency;

    el_select.addEventListener("change", (event) => {
      const next = sanitizeCurrency(event.target.value) || DEFAULT_CURRENCY;
      this.routes[routeIndex].currency = next;
      this.syncValue();
    });

    el_field.appendChild(el_select);
    return el_field;
  }

  createInputField(labelText, value, onInput, options = {}) {
    const el_field = document.createElement("label");
    el_field.className = "route-builder__field";

    const el_label = document.createElement("span");
    el_label.textContent = labelText;
    el_field.appendChild(el_label);

    const el_input = document.createElement("input");
    el_input.type = options.type || "text";
    el_input.value = value;
    if (options.maxLength) {
      el_input.maxLength = options.maxLength;
    }
    if (options.placeholder) {
      el_input.placeholder = options.placeholder;
    }
    if (options.inputmode) {
      el_input.inputMode = options.inputmode;
    }
    if (options.pattern) {
      el_input.pattern = options.pattern;
    }
    if (options.inputmode) {
      el_input.setAttribute("inputmode", options.inputmode);
    }
    if (options.title) {
      el_input.title = options.title;
    }
    if (options.name) {
      el_input.name = options.name;
    }
    el_input.addEventListener("input", (event) => {
      const nextValue = onInput(event.target.value);
      event.target.value = nextValue ?? "";
    });
    el_field.appendChild(el_input);

    return el_field;
  }

  createSegmentsField(route, routeIndex) {
    const el_container = document.createElement("div");
    el_container.className = "route-builder__segments";

    const el_label = document.createElement("span");
    el_label.textContent = this.t("Route");
    el_container.appendChild(el_label);

    const el_list = document.createElement("div");
    el_list.className = "route-builder__segment-list";

    route.airports.forEach((airport, airportIndex) => {
      const el_segment = document.createElement("div");
      el_segment.className = "route-builder__segment";

      const el_input = document.createElement("input");
      el_input.type = "text";
      el_input.maxLength = 3;
      el_input.placeholder =
        airportPlaceholders[airportIndex % airportPlaceholders.length] || "AAA";
      el_input.value = airport;
      el_input.dataset.field = "airport";
      el_input.dataset.routeIndex = `${routeIndex}`;
      el_input.dataset.airportIndex = `${airportIndex}`;
      el_input.name = this.fieldName("segment_route", routeIndex, airportIndex);
      el_input.addEventListener("input", (event) => {
        const nextValue = sanitizeAirport(event.target.value);
        this.routes[routeIndex].airports[airportIndex] = nextValue;
        event.target.value = nextValue;
        const shouldFocusNext = 3 === nextValue.length;
        const updated = this.ensureTrailingAirports(this.routes[routeIndex]);
        if (updated) {
          if (shouldFocusNext) {
            this.queueFocus(routeIndex, airportIndex + 1);
          }
          this.renderRoutes();
        } else {
          if (shouldFocusNext) {
            if (!this.focusAirportInput(routeIndex, airportIndex + 1)) {
              this.queueFocus(routeIndex, airportIndex + 1);
            }
          }
          this.syncValue();
        }
      });
      el_segment.appendChild(el_input);

      const isTrailingEmpty =
        airportIndex === route.airports.length - 1 && airport === "";
      if (route.airports.length > 2 && !isTrailingEmpty) {
        const el_removeSegmentBtn = document.createElement("button");
        el_removeSegmentBtn.type = "button";
        el_removeSegmentBtn.textContent = "−";
        el_removeSegmentBtn.title = this.t("Remove airport");
        el_removeSegmentBtn.addEventListener("click", () => {
          if (route.airports.length <= 2) {
            return;
          }
          this.routes[routeIndex].airports.splice(airportIndex, 1);
          this.ensureTrailingAirports(this.routes[routeIndex]);
          this.renderRoutes();
        });
        el_segment.appendChild(el_removeSegmentBtn);
      }

      el_list.appendChild(el_segment);
    });

    el_container.appendChild(el_list);

    return el_container;
  }

  serializeRoutes() {
    return this.routes
      .map((route) => {
        const carrier = sanitizeAirline(route.carrier);
        const bookingClass = sanitizeClass(route.bookingClass);
        const airports = route.airports
          .map((airport) => sanitizeAirport(airport))
          .filter((airport) => airport.length === 3);

        if (!carrier || !bookingClass || airports.length < 2) {
          return null;
        }

        const ticketingCarrier = sanitizeAirline(
          route.ticketingCarrier || carrier
        );
        const price = sanitizePrice(route.price);
        const sanitizedCurrency = sanitizeCurrency(route.currency);
        const currency = price
          ? sanitizedCurrency || DEFAULT_CURRENCY
          : "";
        const segments = [
          carrier,
          bookingClass,
          airports.join("-"),
          ticketingCarrier,
          price,
          currency,
          route.extras?.trim() ?? "",
        ];

        while (segments.length && "" === segments[segments.length - 1]) {
          segments.pop();
        }

        return segments.join(":");
      })
      .filter(Boolean)
      .join("\n");
  }

  syncValue() {
    const serialized = this.serializeRoutes();
    this._pendingValue = serialized;
    this.dispatchEvent(
      new CustomEvent("route-builder-change", {
        detail: { value: serialized },
        bubbles: true,
      })
    );
  }

  ensureTrailingAirports(route) {
    let mutated = false;
    while (route.airports.length < 2) {
      route.airports.push("");
      mutated = true;
    }
    const last = route.airports[route.airports.length - 1];
    if (last && last.length === 3) {
      route.airports.push("");
      mutated = true;
    }
    while (
      route.airports.length > 2 &&
      route.airports[route.airports.length - 1] === "" &&
      route.airports[route.airports.length - 2] === ""
    ) {
      route.airports.pop();
      mutated = true;
    }
    return mutated;
  }

  captureFocusState() {
    const activeElement = document.activeElement;
    if (
      !activeElement ||
      !this.contains(activeElement) ||
      !activeElement.dataset.field
    ) {
      return null;
    }
    return {
      field: activeElement.dataset.field,
      routeIndex: activeElement.dataset.routeIndex,
      airportIndex: activeElement.dataset.airportIndex,
      start:
        typeof activeElement.selectionStart === "number"
          ? activeElement.selectionStart
          : null,
      end:
        typeof activeElement.selectionEnd === "number"
          ? activeElement.selectionEnd
          : null,
    };
  }

  restoreFocusState(state) {
    if (!state) {
      return;
    }
    const airportSelector =
      state.airportIndex !== undefined && state.airportIndex !== null
        ? `[data-airport-index="${state.airportIndex}"]`
        : "";
    const selector = `[data-field="${state.field}"][data-route-index="${state.routeIndex}"]${airportSelector}`;
    const input = this.querySelector(selector);
    if (!input) {
      return;
    }
    input.focus();
    if (
      state.start !== null &&
      state.end !== null &&
      input.setSelectionRange &&
      "value" in input
    ) {
      input.setSelectionRange(state.start, state.end);
    }
  }

  focusAirportInput(routeIndex, airportIndex) {
    const selector = `input[data-field="airport"][data-route-index="${routeIndex}"][data-airport-index="${airportIndex}"]`;
    const input = this.querySelector(selector);
    if (!input) {
      return false;
    }
    input.focus();
    if (input.setSelectionRange) {
      input.setSelectionRange(0, input.value.length);
    }
    return true;
  }

  queueFocus(routeIndex, airportIndex) {
    this._pendingFocus = {
      field: "airport",
      routeIndex: `${routeIndex}`,
      airportIndex: `${airportIndex}`,
      start: 0,
      end: 0,
    };
  }

  setTranslations(translations = []) {
    this.translations = translations || [];
    if (this._initialized) {
      this.renderRoutes();
    }
  }

  t(key, fallback = key) {
    return translate(`__(${key})`, this.translations) || fallback;
  }

  async loadAirlines() {
    const airlines = await RouteBuilder.preloadAirlines();
    this.airlines = [...airlines];
    this.renderRoutes();
  }
}

RouteBuilder._airlinesCache = null;
RouteBuilder._airlinesPromise = null;

RouteBuilder.preloadAirlines = () => {
  if (RouteBuilder._airlinesCache?.length) {
    return Promise.resolve(RouteBuilder._airlinesCache);
  }

  const globalAirlines =
    "undefined" !== typeof window && window.airlines_with_earnings;
  if (Array.isArray(globalAirlines) && globalAirlines.length) {
    const formatted = formatAirlines(globalAirlines);
    RouteBuilder._airlinesCache = formatted;
    if ("undefined" !== typeof window) {
      window.airlines_with_earnings = formatted;
    }
    return Promise.resolve(formatted);
  }

  if (!RouteBuilder._airlinesPromise) {
    RouteBuilder._airlinesPromise = fetch(AIRLINE_ENDPOINT, {
      mode: "cors",
      headers: {
        Accept: "application/vnd.api+json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Airlines request failed: ${response.status}`);
        }
        return response.json();
      })
      .then((payload) => {
        const source = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
          ? payload.data
          : [];
        const airlines = formatAirlines(source);
        RouteBuilder._airlinesCache = airlines;
        if ("undefined" !== typeof window) {
          window.airlines_with_earnings = airlines;
        }
        return airlines;
      })
      .catch((error) => {
        console.error("Failed to load airlines", error);
        RouteBuilder._airlinesCache = [];
        if ("undefined" !== typeof window) {
          window.airlines_with_earnings = [];
        }
        return [];
      });
  }

  return RouteBuilder._airlinesPromise;
};

RouteBuilder.preloadAirlines();

function formatAirlines(records = []) {
  return records
    .map((item) => {
      const code = sanitizeAirline(item.code || item.iatacode || "");
      if (!code) {
        return null;
      }
      return {
        code,
        name: item.name || code,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name));
}
const airportPlaceholders = Array.from({ length: 26 }, (_, i) => {
  const letter = String.fromCharCode(65 + i);
  return `${letter}${letter}${letter}`;
});
