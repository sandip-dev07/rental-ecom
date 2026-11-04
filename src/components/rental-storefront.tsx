"use client";

import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Backpack,
  Bike,
  CalendarDays,
  Camera,
  Check,
  ChevronDown,
  Info,
  Leaf,
  MapPin,
  Minus,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Truck,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { products, type Product } from "@/lib/products";
import { GearImage } from "@/components/gear-image";
import { ProductDetail } from "@/components/product-detail";
import { DayPicker } from "react-day-picker";
import { useIsMobile } from "@/hooks/use-mobile";
import "react-day-picker/style.css";

const categories = [
  {
    name: "Cameras",
    icon: Camera,
    caption: "For moments worth keeping.",
    detail: "DSLRs, action cameras & lenses",
    image: "photography.webp",
    color: "peach",
    tag: "CAPTURE MORE",
  },
  {
    name: "Phones",
    icon: Smartphone,
    caption: "An upgrade. Without the commitment.",
    detail: "iPhones & everyday flagships",
    image: "phone.png",
    color: "lavender",
    tag: "STAY CONNECTED",
  },
  {
    name: "Outdoor gear",
    icon: Backpack,
    caption: "Less baggage. More adventure.",
    detail: "Tents, backpacks & trekking gear",
    image: "outdoor.webp",
    color: "sage",
    tag: "GO A LITTLE FURTHER",
  },
  {
    name: "Bikes",
    icon: Bike,
    caption: "Take the road less travelled.",
    detail: "City rides & weekend explorers",
    image: "bike.png",
    color: "yellow",
    tag: "FIND YOUR FREEDOM",
  },
];
const questions = [
  [
    "How does renting work?",
    "Choose your gear, select your rental dates, and add items to your shortlist. This is a demo storefront: checkout, identity verification, and confirmed reservations will be available when the rental service launches.",
  ],
  [
    "Can I rent for just a day?",
    "The demo supports rentals from one day onwards. Use the date selector to see an estimated total for your trip. Final rental periods and availability will depend on the item.",
  ],
  [
    "Is a security deposit required?",
    "Deposit requirements will be listed with each item when live bookings are enabled. The prices shown here are illustrative rental estimates and do not include deposits.",
  ],
  [
    "Where can I get my gear delivered?",
    "Bangalore is the planned launch city. Delivery coverage, fees, and pickup options will be confirmed before booking. No delivery or reservation is arranged through this demo.",
  ],
];
export default function RentalStorefront({ product }: { product?: Product }) {
  const router = useRouter();
  const [bagLoaded, setBagLoaded] = useState(false);
  const [category, setCategory] = useState("All gear");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<number[]>([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [draftStart, setDraftStart] = useState(start);
  const [draftEnd, setDraftEnd] = useState(end);
  const [pendingProduct, setPendingProduct] = useState<number | null>(null);
  const [today, setToday] = useState("");
  const isMobile = useIsMobile();
  const [activeDate, setActiveDate] = useState<"delivery" | "pickup">(
    "delivery",
  );
  const [calendarMonth, setCalendarMonth] = useState<Date>();
  const [dateError, setDateError] = useState("");
  const [panel, setPanel] = useState<"dates" | "cart" | "city" | null>(null);
  const modal = useRef<HTMLDialogElement>(null);
  const search = useRef<HTMLInputElement>(null);
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem("rento-bag") || "null");
      if (
        saved &&
        Array.isArray(saved.cart) &&
        typeof saved.start === "string" &&
        typeof saved.end === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(saved.start) &&
        /^\d{4}-\d{2}-\d{2}$/.test(saved.end) &&
        Date.parse(saved.end) > Date.parse(saved.start)
      ) {
        setCart([
          ...new Set<number>(
            saved.cart.filter((id: unknown) =>
              products.some((item) => item.id === id),
            ),
          ),
        ]);
        setStart(saved.start);
        setEnd(saved.end);
      }
    } catch {
      /* An unavailable or stale session starts with an empty bag. */
    }
    setBagLoaded(true);
  }, []);
  useEffect(() => {
    if (!bagLoaded) return;
    try {
      sessionStorage.setItem("rento-bag", JSON.stringify({ cart, start, end }));
    } catch {
      /* The bag still works in memory when storage is unavailable. */
    }
  }, [bagLoaded, cart, start, end]);

  const days =
    start && end
      ? Math.max(
          0,
          Math.round((Date.parse(end) - Date.parse(start)) / 86400000),
        )
      : 0;
  const draftDays =
    draftStart && draftEnd && draftStart >= today
      ? Math.max(
          0,
          Math.round(
            (Date.parse(draftEnd) - Date.parse(draftStart)) / 86400000,
          ),
        )
      : 0;
  const visible = products.filter(
    (p) =>
      (category === "All gear" || p.category === category) &&
      `${p.name} ${p.category}`.toLowerCase().includes(query.toLowerCase()),
  );
  const total = products
    .filter((p) => cart.includes(p.id))
    .reduce((sum, p) => sum + p.price * days, 0);
  const formatDate = (date: string) =>
    date
      ? new Date(`${date}T12:00:00`).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
        })
      : "Select date";
  function openPanel(
    value: "dates" | "cart" | "city",
    productId: number | null = null,
  ) {
    setPendingProduct(productId);
    setActiveDate("delivery");
    setCalendarMonth(start ? new Date(`${start}T12:00:00`) : undefined);
    setToday(
      new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date()),
    );
    setPanel(value);
    setDraftStart(start);
    setDraftEnd(end);
    setDateError("");
    if (!modal.current?.open) modal.current?.showModal();
  }
  function browse(value = "All gear") {
    if (product) {
      router.push("/#rentals");
      return;
    }
    setCategory(value);
    setQuery("");
    document.getElementById("rentals")?.scrollIntoView({ behavior: "smooth" });
  }
  function toggleCart(id: number) {
    setCart((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  }

  return (
    <>
      <div className="announcement">
        <span>A little less owning. A lot more living.</span>
        <Leaf size={13} />
        <span>Meet your next adventure.</span>
      </div>
      <header className="site-header wrap">
        <a href="/" className="wordmark" aria-label="Rento home">
          rento<span>.</span>
        </a>
        <button className="location-button" onClick={() => openPanel("city")}>
          <MapPin size={17} />
          <span>Bangalore</span>
          <ChevronDown size={13} />
        </button>
        <nav aria-label="Main navigation">
          <a href="/#categories">Explore gear</a>
          <a href="/#how-it-works">How it works</a>
          <a href="/#why-rent">Why rent?</a>
        </nav>
        <div className="header-actions">
          <button
            className="icon-button"
            aria-label="Search rentals"
            onClick={() => {
              if (product) {
                router.push("/#rentals");
                return;
              }
              document
                .getElementById("rentals")
                ?.scrollIntoView({ behavior: "smooth" });
              search.current?.focus({ preventScroll: true });
            }}
          >
            <Search size={21} />
          </button>
          <button
            className="cart-button"
            onClick={() => openPanel("cart")}
            aria-label={`Open rental bag, ${cart.length} items`}
          >
            <ShoppingBag size={20} />
            <span className="bag-label">Your bag</span>
            <span className="cart-count">{cart.length}</span>
          </button>
        </div>
      </header>
      <main>
        {product ? (
          <ProductDetail
            product={product}
            added={cart.includes(product.id)}
            onRent={() => openPanel("dates", product.id)}
            onBag={() => openPanel("cart")}
          />
        ) : (
          <>
            <section className="hero">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <div className="orbit orbit-three" />
              <div className="hero-float floating-camera">
                <GearImage name="camera.webp" alt="" priority />
                <span className="floating-note">Make memories ↗</span>
              </div>
              <div className="hero-float floating-backpack">
                <GearImage name="backpack.webp" alt="" priority />
              </div>
              <div className="hero-float floating-gopro">
                <GearImage name="gopro.webp" alt="" priority />
              </div>
              <div className="hero-float floating-tent">
                <GearImage name="camp.webp" alt="" priority />
                <span className="floating-note">Chase a little adventure</span>
              </div>
              <div className="hero-copy">
                <div className="eyebrow">
                  <span /> BIG PLANS. SMALL COMMITMENTS.
                </div>
                <h1>
                  Own the moment.
                  <br />
                  Rent the{" "}
                  <span className="serif-word">
                    possibilities.
                    <svg viewBox="0 0 500 20" aria-hidden="true">
                      <path d="M5 14 Q230 -6 492 12 M52 19 Q260 5 447 17" />
                    </svg>
                  </span>
                </h1>
                <p>
                  The camera. The road trip. The weekend away.
                  <br />
                  Everything you need, for just as long as you need it.
                </p>
                <div className="hero-cta">
                  <a href="/#categories" className="button primary">
                    Explore rentals <ArrowUpRight size={18} />
                  </a>
                  <a href="/#how-it-works" className="text-link">
                    How it works <ArrowRight size={16} />
                  </a>
                </div>
                <div className="hero-benefits">
                  <span>
                    <Leaf size={16} /> Kinder to the planet
                  </span>
                  <span className="benefit-divider" />
                  <span>
                    <Wallet size={16} /> Easier on your pocket
                  </span>
                </div>
              </div>
              <div className="categories wrap" id="categories">
                <div className="category-heading">
                  <span>A LITTLE SOMETHING FOR EVERY PLAN</span>
                  <span>
                    What are you up to? <ArrowDown size={14} />
                  </span>
                </div>
                <div className="category-grid">
                  {categories.map((item) => (
                    <button
                      key={item.name}
                      className={`category-card ${item.color}`}
                      onClick={() => browse(item.name)}
                    >
                      <div className="category-top">
                        <item.icon size={20} strokeWidth={1.6} />
                        <ArrowUpRight size={20} />
                      </div>
                      <h2>{item.name}</h2>
                      <p>{item.detail}</p>
                      <div className="category-picture">
                        <GearImage
                          name={item.image}
                          alt={item.detail}
                          priority
                        />
                      </div>
                      <div className="category-bottom">
                        <span>Explore {item.name.toLowerCase()}</span>
                        <span className="round-arrow">
                          <ArrowRight size={16} />
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <a className="scroll-cue" href="/#rentals">
                GOOD TIMES START HERE <ArrowDown size={14} />
              </a>
            </section>
            <div className="service-strip">
              <div className="wrap">
                <span>
                  <Truck /> Delivered to your doorstep
                </span>
                <span>
                  <ShieldCheck /> Quality-checked gear
                </span>
                <span>
                  <CalendarDays /> Your dates. Your plans.
                </span>
                <span>
                  <Leaf /> More experiences, less stuff
                </span>
              </div>
            </div>
            <section className="rentals wrap section" id="rentals">
              <div className="section-heading">
                <div className="section-title">
                  <span className="eyebrow">PACK YOUR NEXT PLAN</span>
                  <h2>
                    Good gear.{" "}
                    <span className="serif-word">Great stories.</span>
                  </h2>
                  <p>A few things to turn “we should” into “let’s go”.</p>
                </div>
                <button
                  className="date-button"
                  onClick={() => openPanel("dates")}
                >
                  <CalendarDays size={18} />
                  <span>
                    {formatDate(start)} — {formatDate(end)}
                  </span>
                  <span className="date-edit">
                    Edit <ChevronDown size={12} />
                  </span>
                </button>
              </div>
              <div className="catalog-controls">
                <div className="filters" aria-label="Filter rental category">
                  {["All gear", ...categories.map((c) => c.name)].map(
                    (name) => (
                      <button
                        key={name}
                        aria-pressed={category === name}
                        className={category === name ? "active" : ""}
                        onClick={() => setCategory(name)}
                      >
                        {name}
                      </button>
                    ),
                  )}
                </div>
                <label className="search-field">
                  <Search size={17} />
                  <input
                    ref={search}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Find your gear"
                    aria-label="Search gear"
                  />
                  {query && (
                    <button
                      aria-label="Clear search"
                      onClick={() => setQuery("")}
                    >
                      <X size={14} />
                    </button>
                  )}
                </label>
              </div>
              <div className="product-grid">
                {visible.map((product) => (
                  <article className="product-card" key={product.id}>
                    <Link
                      href={`/products/${product.id}`}
                      className="product-image"
                      aria-label={`View ${product.name}`}
                    >
                      <span className="product-label">{product.label}</span>
                      <GearImage name={product.image} alt={product.name} />
                    </Link>
                    <div className="product-info">
                      <span className="product-category">
                        {product.category}
                      </span>
                      <h3>
                        <Link href={`/products/${product.id}`}>
                          {product.name}
                        </Link>
                      </h3>
                      <p>{product.description}</p>
                      <div className="product-bottom">
                        <span>
                          <strong>
                            ₹{product.price.toLocaleString("en-IN")}
                          </strong>
                          <small> / day</small>
                        </span>
                        <button
                          className={
                            cart.includes(product.id)
                              ? "add-button added"
                              : "add-button"
                          }
                          onClick={() =>
                            cart.includes(product.id)
                              ? toggleCart(product.id)
                              : openPanel("dates", product.id)
                          }
                          aria-label={`${cart.includes(product.id) ? "Remove" : "Add"} ${product.name} ${cart.includes(product.id) ? "from" : "to"} bag`}
                        >
                          {cart.includes(product.id) ? (
                            <Check size={17} />
                          ) : (
                            <Plus size={17} />
                          )}
                          <span>
                            {cart.includes(product.id) ? "Added" : "Add to bag"}
                          </span>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              {!visible.length && (
                <div className="empty-state">
                  <Search size={30} />
                  <h3>No gear found</h3>
                  <p>Try a different search or explore all categories.</p>
                  <button
                    className="button primary"
                    onClick={() => {
                      setQuery("");
                      setCategory("All gear");
                    }}
                  >
                    Explore all gear
                  </button>
                </div>
              )}
              <p className="demo-note">
                A preview of what’s possible. Sample catalog and prices; live
                bookings coming soon.
              </p>
            </section>
            <section className="how-section" id="how-it-works">
              <div className="wrap">
                <div className="section-title">
                  <span className="eyebrow">LESS EFFORT. MORE EXPERIENCE.</span>
                  <h2>
                    Your next adventure,
                    <br />
                    <span className="serif-word">three little steps away.</span>
                  </h2>
                </div>
                <div className="steps">
                  {[
                    {
                      icon: Search,
                      title: "Find your thing",
                      text: "A creative project or a spontaneous escape. Pick the gear that fits your plan.",
                    },
                    {
                      icon: CalendarDays,
                      title: "Make it yours. For a bit.",
                      text: "Choose your dates and build your rental bag. Keep it for the time you need.",
                    },
                    {
                      icon: Sparkles,
                      title: "Make memories. Repeat.",
                      text: "Enjoy every moment, return the gear, and start dreaming about what’s next.",
                    },
                  ].map((step, index) => (
                    <div className="step" key={step.title}>
                      <div className="step-top">
                        <step.icon size={24} />
                        <span>0{index + 1}</span>
                      </div>
                      <h3>{step.title}</h3>
                      <p>{step.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            <section className="why-section wrap section" id="why-rent">
              <div className="why-visual">
                <GearImage
                  name="backpack.webp"
                  alt="A backpack ready for a weekend adventure"
                />
                <div className="adventure-label">
                  COLLECT MOMENTS.
                  <br />
                  NOT MORE STUFF.
                  <Sparkles size={25} />
                </div>
                <span className="little-star">✳</span>
              </div>
              <div className="why-copy">
                <span className="eyebrow">A LIGHTER WAY TO LIVE</span>
                <h2>
                  More living.
                  <br />
                  <span className="serif-word">Less owning.</span>
                </h2>
                <p>
                  Some things are better borrowed. The gear you use for a
                  weekend shouldn’t take up space for a lifetime.
                </p>
                <p>
                  Rent what you need. Try something new. Leave a little more
                  room for the experiences that matter.
                </p>
                <a href="/#categories" className="button primary">
                  Make room for more <ArrowUpRight size={18} />
                </a>
                <span className="planet-note">
                  <Leaf size={17} /> Good for your plans. Better for the planet.
                </span>
              </div>
            </section>
            <section className="faq-section wrap section">
              <div className="section-title">
                <span className="eyebrow">A FEW THINGS TO KNOW</span>
                <h2>
                  Curious? <span className="serif-word">Good.</span>
                </h2>
                <p>Let’s make renting feel simple.</p>
              </div>
              <div className="faq-list">
                {questions.map(([question, answer]) => (
                  <details key={question}>
                    <summary>
                      {question}
                      <Plus size={18} />
                    </summary>
                    <p>{answer}</p>
                  </details>
                ))}
              </div>
            </section>
            <section className="closing-banner wrap">
              <span>YOUR NEXT “REMEMBER WHEN” STARTS HERE.</span>
              <h2>
                Go on. <span className="serif-word">Make a plan.</span>
              </h2>
              <a href="/#categories" className="button dark-button">
                Explore the possibilities <ArrowUpRight size={18} />
              </a>
              <span className="banner-star" aria-hidden="true">
                ✳
              </span>
            </section>
          </>
        )}
      </main>
      <footer className="wrap">
        <div className="footer-main">
          <a href="/" className="wordmark">
            rento<span>.</span>
          </a>
          <p>Great experiences. Without the baggage.</p>
          <div>
            <a href="/#categories">Explore gear</a>
            <a href="/#how-it-works">How it works</a>
            <a href="/#why-rent">Our philosophy</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Rento. Made for making memories.</span>
          <span>
            Starting in Bangalore <MapPin size={13} />
          </span>
        </div>
      </footer>
      <dialog
        ref={modal}
        className={`rental-dialog${panel === "dates" ? " date-selection-dialog" : ""}`}
        aria-label={
          panel === "dates"
            ? "Select your Dates"
            : panel === "cart"
              ? "Your rental bag"
              : "Delivery city"
        }
        onClose={() => {
          setPanel(null);
          setPendingProduct(null);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) modal.current?.close();
        }}
      >
        <div className="dialog-content">
          <button
            className="dialog-close icon-button"
            aria-label="Close dialog"
            onClick={() => modal.current?.close()}
          >
            <X size={22} />
          </button>
          {panel === "dates" && (
            <>
              <h2>Select your Dates</h2>
              {cart.length > 0 && (
                <p>These dates apply to all items in your bag.</p>
              )}
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  if (
                    !draftStart ||
                    !draftEnd ||
                    draftStart < today ||
                    draftEnd <= draftStart
                  ) {
                    setDateError(
                      "Choose a delivery date today or later and a pickup date after delivery.",
                    );
                    return;
                  }
                  setStart(draftStart);
                  setEnd(draftEnd);
                  if (pendingProduct !== null) {
                    setCart((previous) =>
                      previous.includes(pendingProduct)
                        ? previous
                        : [...previous, pendingProduct],
                    );
                  }
                  modal.current?.close();
                }}
              >
                <div className="date-fields">
                  {(["delivery", "pickup"] as const).map((field) => {
                    const value = field === "delivery" ? draftStart : draftEnd;
                    return (
                      <div className="date-field" key={field}>
                        <span id={`${field}-label`}>
                          {field === "delivery" ? "Delivery" : "Pickup"} Date{" "}
                          <span className="date-required">*</span>
                        </span>
                        <button
                          type="button"
                          className={`date-field-button${activeDate === field ? " is-active" : ""}${value ? " has-value" : ""}`}
                          aria-labelledby={`${field}-label ${field}-value`}
                          aria-controls="rental-calendar"
                          aria-pressed={activeDate === field}
                          onClick={() => {
                            setActiveDate(field);
                            setDateError("");
                          }}
                        >
                          <CalendarDays size={20} aria-hidden="true" />
                          <span id={`${field}-value`}>
                            {value ? formatDate(value) : `Select ${field} date`}
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div
                  className="rental-period"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <p>Your Rental Period:</p>
                  <div className="date-periods">
                    <div className="rental-day-count">
                      <strong>{String(draftDays).padStart(2, "0")}</strong>
                      <span>{draftDays > 1 ? "Days" : "Day"}</span>
                    </div>
                    <div className="chargeable-period">
                      <span>Chargeable Period:</span>
                      <div>
                        <CalendarDays size={20} aria-hidden="true" />
                        <span>
                          {draftDays > 0
                            ? `${draftDays} ${draftDays === 1 ? "Day" : "Days"}`
                            : "--"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div id="rental-calendar" className="rental-calendar">
                  <span className="sr-only" aria-live="polite">
                    Select your {activeDate} date
                  </span>
                  <DayPicker
                    mode="range"
                    numberOfMonths={isMobile ? 1 : 2}
                    month={calendarMonth}
                    onMonthChange={setCalendarMonth}
                    startMonth={
                      today ? new Date(`${today}T12:00:00`) : undefined
                    }
                    today={today ? new Date(`${today}T12:00:00`) : undefined}
                    showOutsideDays
                    disabled={
                      today
                        ? { before: new Date(`${today}T00:00:00`) }
                        : undefined
                    }
                    selected={
                      draftStart
                        ? {
                            from: new Date(`${draftStart}T12:00:00`),
                            to: draftEnd
                              ? new Date(`${draftEnd}T12:00:00`)
                              : undefined,
                          }
                        : undefined
                    }
                    onSelect={(_range, day, modifiers) => {
                      if (modifiers.disabled) return;
                      const date = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
                      setDateError("");
                      if (activeDate === "delivery" || !draftStart) {
                        setDraftStart(date);
                        if (draftEnd <= date) setDraftEnd("");
                        setActiveDate("pickup");
                      } else if (date <= draftStart) {
                        setDateError(
                          "Choose a pickup date after your delivery date.",
                        );
                      } else {
                        setDraftEnd(date);
                      }
                    }}
                  />
                </div>
                {dateError && (
                  <p role="alert" className="date-error">
                    {dateError}
                  </p>
                )}
                <button
                  className="button primary"
                  type="submit"
                  disabled={draftDays < 1}
                >
                  Continue
                  <ArrowRight size={17} />
                </button>
              </form>
            </>
          )}
          {panel === "city" && (
            <>
              <span className="eyebrow">
                YOUR NEIGHBOURHOOD, MORE POSSIBILITIES
              </span>
              <h2>Hello, Bangalore.</h2>
              <p>
                Our planned first stop. Explore the demo catalog and get
                inspired for your next adventure.
              </p>
              <div className="city-selection">
                <MapPin size={20} />
                <strong>Bangalore</strong>
                <span>Coming soon</span>
                <Check size={18} />
              </div>
              <p className="demo-note">
                More cities are on the horizon. Live delivery and bookings are
                not yet available.
              </p>
            </>
          )}
          {panel === "cart" && (
            <>
              <span className="eyebrow">YOUR NEXT ADVENTURE</span>
              <h2>
                Your rental bag <span className="muted">({cart.length})</span>
              </h2>
              <p>
                {formatDate(start)} – {formatDate(end)} · {days}{" "}
                {days === 1 ? "day" : "days"}
                <button
                  className="inline-button"
                  onClick={() => openPanel("dates")}
                >
                  Edit dates
                </button>
              </p>
              {cart.length ? (
                <>
                  <div className="cart-list">
                    {products
                      .filter((p) => cart.includes(p.id))
                      .map((product) => (
                        <div className="cart-item" key={product.id}>
                          <GearImage name={product.image} alt={product.name} />
                          <div>
                            <h3>{product.name}</h3>
                            <span>
                              ₹{product.price} × {days} days
                            </span>
                          </div>
                          <strong>
                            ₹{(product.price * days).toLocaleString("en-IN")}
                          </strong>
                          <button
                            className="icon-button"
                            aria-label={`Remove ${product.name}`}
                            onClick={() => toggleCart(product.id)}
                          >
                            <Minus size={16} />
                          </button>
                        </div>
                      ))}
                  </div>
                  <div className="cart-total">
                    <span>Estimated rental total</span>
                    <strong>₹{total.toLocaleString("en-IN")}</strong>
                  </div>
                  <div className="booking-notice">
                    <ShieldCheck size={22} />
                    <p>
                      Your demo shortlist is ready. Live reservations and
                      payments are coming soon. No booking has been placed.
                    </p>
                  </div>
                </>
              ) : (
                <div className="empty-state">
                  <ShoppingBag size={36} />
                  <h3>A little room for adventure.</h3>
                  <p>Find something you love and add it to your bag.</p>
                  <button
                    className="button primary"
                    onClick={() => {
                      modal.current?.close();
                      browse();
                    }}
                  >
                    Explore gear <ArrowRight size={17} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </dialog>
    </>
  );
}
