"use client";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  MapPin,
  Package,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { GearImage } from "@/components/gear-image";
import { type Product, products } from "@/lib/products";

const details: Record<
  number,
  {
    about: string;
    included: string[];
    use: string;
    owner: string;
    initials: string;
    area: string;
  }
> = {
  1: {
    about:
      "Make the little moments look extraordinary. A DSLR rental for portraits, weekend trips, and getting comfortable behind the lens without buying a whole setup.",
    included: [
      "Camera body",
      "Standard lens",
      "Battery and charger",
      "Protective carry bag",
    ],
    use: "Travel, portraits & learning photography",
    owner: "Arjun's Camera Corner",
    initials: "AC",
    area: "Indiranagar",
  },
  2: {
    about:
      "A little upgrade for your everyday. Explore an iPhone for a trip, a creative project, or a short-term replacement. Exact model, storage, and colour will be confirmed before booking.",
    included: ["iPhone handset", "Charging cable", "Protective case"],
    use: "Everyday use & content creation",
    owner: "Meera's Tech Shelf",
    initials: "MT",
    area: "Koramangala",
  },
  3: {
    about:
      "Take a break from four walls. This camping tent is a starting point for slow mornings outdoors and weekends under the stars. Capacity and weather suitability must be confirmed for your trip.",
    included: ["Tent body", "Tent poles", "Pegs and guy lines", "Carry bag"],
    use: "Campsites & weekend getaways",
    owner: "The Weekend Collective",
    initials: "WC",
    area: "HSR Layout",
  },
  4: {
    about:
      "Make the journey part of the adventure. Explore a Himalayan 450 rental for your next ride. Vehicle condition, documents, mileage allowance, and riding requirements are confirmed before a live booking.",
    included: ["Motorcycle", "Vehicle keys", "Vehicle document copies"],
    use: "Touring & weekend rides",
    owner: "The Open Road Garage",
    initials: "OR",
    area: "JP Nagar",
  },
  5: {
    about:
      "Bring the adventure home with you. A compact action-camera rental for recording rides, trips, and those blink-and-you-miss-it moments. Confirm mounts and activity suitability before your trip.",
    included: ["Action camera", "Battery", "Charging cable", "Protective case"],
    use: "Action footage & travel stories",
    owner: "Arjun's Camera Corner",
    initials: "AC",
    area: "Indiranagar",
  },
  6: {
    about:
      "Pack for the trail, not for a lifetime of storage. Rent a trekking backpack for your next escape. Capacity, fit, and rain protection should be confirmed before choosing your route.",
    included: ["Trekking backpack", "Adjustable shoulder straps"],
    use: "Day hikes & trekking trips",
    owner: "The Weekend Collective",
    initials: "WC",
    area: "HSR Layout",
  },
};
const reviews = [
  {
    name: "Priya S.",
    initials: "PS",
    title: "An easy weekend rental",
    text: "The handover was straightforward and the gear was packed carefully. A lovely way to try something before buying it.",
  },
  {
    name: "Rahul M.",
    initials: "RM",
    title: "Helpful from start to finish",
    text: "Clear instructions and a friendly owner made planning the trip much easier. Would happily rent again.",
  },
];

export function ProductDetail({
  product,
  added,
  onRent,
  onBag,
}: {
  product: Product;
  added: boolean;
  onRent: () => void;
  onBag: () => void;
}) {
  const detail = details[product.id];
  return (
    <div className="product-detail wrap">
      <nav className="detail-breadcrumb" aria-label="Breadcrumb">
        <Link href="/#rentals">
          <ArrowLeft size={14} /> All gear
        </Link>
        <ChevronRight size={13} />
        <span>{product.category}</span>
        <ChevronRight size={13} />
        <span aria-current="page">{product.name}</span>
      </nav>
      <div className="detail-hero">
        <div className="detail-visual">
          <span className="detail-tag">
            <SparkleLabel />
            {product.label}
          </span>
          <GearImage name={product.image} alt={product.name} priority />
          <span className="detail-image-caption">
            A little less owning. A lot more living.
          </span>
        </div>
        <section className="detail-intro" aria-labelledby="product-title">
          <span className="eyebrow">
            {product.category} / RENT THE POSSIBILITIES
          </span>
          <h1 id="product-title">{product.name}</h1>
          <p className="detail-subtitle">{product.description}</p>
          <div className="detail-meta">
            <a href="#reviews">
              <Star size={15} fill="currentColor" /> 4.8{" "}
              <span>· 2 sample reviews</span>
            </a>
            <span>
              <MapPin size={15} /> Bangalore
            </span>
          </div>
          <div className="detail-booking">
            <span className="detail-price-label">
              A great experience, a little less spend.
            </span>
            <div className="detail-price">
              <strong>₹{product.price.toLocaleString("en-IN")}</strong>
              <span>/ day</span>
            </div>
            <p>Choose your dates for a rental estimate.</p>
            <button
              type="button"
              className="button primary"
              onClick={added ? onBag : onRent}
            >
              {added ? "View in your bag" : "Select dates & rent"}
              <ArrowRight size={18} />
            </button>
            {added && (
              <button type="button" className="detail-edit" onClick={onRent}>
                Change rental dates
              </button>
            )}
            <div className="detail-booking-note">
              <CalendarDays size={16} />
              <span>From 1 day · Delivery and pickup dates required</span>
            </div>
            <p className="detail-disclaimer">
              Demo listing. Prices are estimates; availability, deposits,
              delivery fees, and final terms are not yet confirmed.
            </p>
          </div>
          <div className="detail-promises">
            <span>
              <Package size={19} /> Thoughtfully packed
            </span>
            <span>
              <Truck size={19} /> Bangalore delivery planned
            </span>
          </div>
        </section>
      </div>
      <div className="detail-columns">
        <div className="detail-main">
          <section className="detail-section">
            <span className="eyebrow">GET TO KNOW YOUR GEAR</span>
            <h2>A little about this rental.</h2>
            <p>{detail.about}</p>
            <dl className="detail-specs">
              <div>
                <dt>Best for</dt>
                <dd>{detail.use}</dd>
              </div>
              <div>
                <dt>Category</dt>
                <dd>{product.category}</dd>
              </div>
              <div>
                <dt>Condition</dt>
                <dd>To be checked before handover</dd>
              </div>
              <div>
                <dt>Exact specifications</dt>
                <dd>Confirmed with the owner before booking</dd>
              </div>
            </dl>
          </section>
          <section className="detail-section">
            <h2>What comes with it.</h2>
            <p className="detail-caption">
              Illustrative kit — final contents will be confirmed before
              booking.
            </p>
            <ul className="detail-included">
              {detail.included.map((item) => (
                <li key={item}>
                  <Check size={16} />
                  {item}
                </li>
              ))}
            </ul>
          </section>
          <section className="detail-section" id="reviews">
            <div className="detail-section-heading">
              <h2>Good gear. Happy adventures.</h2>
              <span className="detail-demo-label">Sample reviews</span>
            </div>
            <div className="detail-review-summary">
              <strong>
                4.8 <Star size={22} fill="currentColor" />
              </strong>
              <span>Illustrative rating · not verified customer feedback</span>
            </div>
            {reviews.map((review) => (
              <article className="detail-review" key={review.name}>
                <div className="detail-review-top">
                  <span className="detail-avatar small">{review.initials}</span>
                  <div>
                    <strong>{review.name}</strong>
                    <span>Demo renter</span>
                  </div>
                  <span
                    className="detail-stars"
                    role="img"
                    aria-label="5 out of 5 stars"
                  >
                    ★★★★★
                  </span>
                </div>
                <h3>{review.title}</h3>
                <p>{review.text}</p>
              </article>
            ))}
          </section>
        </div>
        <aside className="detail-sidebar">
          <section className="detail-owner">
            <div className="detail-section-heading">
              <span className="eyebrow">MEET THE OWNER</span>
              <span className="detail-demo-label">Demo profile</span>
            </div>
            <div className="detail-owner-profile">
              <span className="detail-avatar">{detail.initials}</span>
              <div>
                <h2>{detail.owner}</h2>
                <span>
                  <MapPin size={13} />
                  {detail.area}, Bangalore
                </span>
              </div>
            </div>
            <p>
              A neighbourhood gear enthusiast helping you make more memories
              with less stuff.
            </p>
            <div className="detail-owner-facts">
              <span>
                <Star size={16} />
                4.9 sample owner rating
              </span>
              <span>
                <Clock3 size={16} />
                Response time not yet available
              </span>
              <span>
                <ShieldCheck size={16} />
                Identity verification pending
              </span>
            </div>
            <p className="detail-caption">
              Owner profiles are illustrative. Contact and live bookings will be
              available at launch.
            </p>
          </section>
          <section className="detail-terms">
            <h2>The small, important things.</h2>
            {[
              [
                "Delivery & pickup",
                "Same-day delivery is planned between 5PM and 11PM, with pickup between 9AM and 1PM. Coverage and time slots will be confirmed before booking.",
              ],
              [
                "Deposit & identification",
                "A deposit and ID verification may be required. Any requirements will be shown before a live booking is confirmed.",
              ],
              [
                "Cancellations & extensions",
                "Cancellation terms are not yet published. Extensions depend on availability and must be agreed before the scheduled return.",
              ],
              [
                "Care & returns",
                "Check the item and accessories at handover. Return everything in the same condition and report any damage or missing parts.",
              ],
            ].map(([title, text]) => (
              <details key={title}>
                <summary>
                  {title}
                  <ChevronRight size={15} />
                </summary>
                <p>{text}</p>
              </details>
            ))}
          </section>
        </aside>
      </div>
      <section className="detail-related">
        <div className="detail-section-heading">
          <div>
            <span className="eyebrow">A LITTLE MORE POSSIBILITY</span>
            <h2>Make it an adventure.</h2>
          </div>
          <Link href="/#rentals">
            Explore all gear <ArrowRight size={16} />
          </Link>
        </div>
        <div className="detail-related-grid">
          {products
            .filter((item) => item.id !== product.id)
            .slice(0, 3)
            .map((item) => (
              <Link
                className="detail-related-card"
                href={`/products/${item.id}`}
                key={item.id}
              >
                <GearImage name={item.image} alt={item.name} />
                <div>
                  <span>{item.category}</span>
                  <h3>{item.name}</h3>
                  <p>
                    ₹{item.price.toLocaleString("en-IN")} <small>/ day</small>
                  </p>
                </div>
                <ArrowRight size={18} />
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
function SparkleLabel() {
  return <Star size={12} aria-hidden="true" />;
}
