import { Link } from "react-router-dom";

import { fmtDate, money, routeCode } from "../utils.js";
import ProgressBar from "./ProgressBar.jsx";
import StatusChip from "./StatusChip.jsx";

export default function TripCard({ trip }) {
  const { checklist, budget } = trip;
  return (
    <article className={`pass ${trip.status === "Completed" ? "pass-completed" : ""}`}>
      <div className="pass-main">
        <div className="pass-route" aria-hidden="true">
          {trip.destinations.map((d, i) => (
            <span key={`${d}-${i}`} className="route-leg">
              {i > 0 && <span className="route-arrow">→</span>}
              <span className="route-code">{routeCode(d)}</span>
            </span>
          ))}
        </div>
        <h3 className="pass-name">
          <Link to={`/trips/${trip.id}`}>{trip.name}</Link>
        </h3>
        <p className="pass-destinations">{trip.destinations.join(" · ")}</p>
        <p className="pass-dates mono">
          {fmtDate(trip.start_date)} — {fmtDate(trip.end_date)}
        </p>
        <StatusChip status={trip.status} />
        {trip.status === "Completed" && (
          <span className="postmark" aria-hidden="true">
            Completed
          </span>
        )}
      </div>
      <div className="pass-divider" aria-hidden="true" />
      <div className="pass-stub">
        {checklist && (
          <div className="stub-block">
            <span className="stub-label">Checklist</span>
            <span className="mono stub-value">
              {checklist.done}/{checklist.total} · {checklist.percent}%
            </span>
            <ProgressBar percent={checklist.percent} label={`${trip.name} checklist completion`} />
          </div>
        )}
        {budget && (
          <div className="stub-block">
            <span className="stub-label">Budget</span>
            <span className="mono stub-value">
              {money(budget.planned)} planned · {money(budget.actual)} spent
            </span>
          </div>
        )}
        <Link className="btn btn-quiet stub-open" to={`/trips/${trip.id}`}>
          Open trip
        </Link>
      </div>
    </article>
  );
}
