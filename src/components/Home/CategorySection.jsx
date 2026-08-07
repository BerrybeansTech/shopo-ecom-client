import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useProducts } from "../AllProductPage/hooks/useProducts";

/* ─── CSS ─────────────────────────────────────────────────────────────── */
const STYLES = `
  .cat-img-wrap { 
    overflow: hidden; 
    border-radius: 24px;
    background: #f1f3f5;
  }
  
  .cat-img { 
     width: 100%; 
     height: 100%; 
     object-fit: cover; 
     transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), 
                 opacity 0.6s ease-in-out;
  }

  .cat-img-wrap:hover .cat-img,
  .mini-card:hover .cat-img { transform: scale(1.08); }

  .mini-card {
    position: relative; overflow: hidden; cursor: pointer;
    border-radius: 18px;
    transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
                box-shadow 0.3s ease;
    scroll-snap-align: center;
    will-change: transform;
  }
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { 
    -ms-overflow-style: none; 
    scrollbar-width: none; 
    -webkit-overflow-scrolling: touch;
  }
  .touch-carousel {
    /* NO scroll-behavior:smooth here — it animates position teleports and causes jump */
    touch-action: pan-x;
    -webkit-overflow-scrolling: touch;
  }
  .mini-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.12); }
  .mini-card.ring-active {
    box-shadow: 0 0 0 3px #fff, 0 0 0 5px #000, 0 12px 32px rgba(0,0,0,0.2);
  }

  .mini-hover-layer {
    position: absolute; inset: 0;
    background: rgba(0,0,0,0);
    transition: background 0.4s ease;
    display: flex; align-items: flex-end;
  }
  .mini-card:hover .mini-hover-layer { background: rgba(0,0,0,0.1); }

  /* pulse dot */
  @keyframes pulseRing {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.55; transform: scale(1.4); }
  }
  .pulse-dot { animation: pulseRing 2s ease infinite; }
`;

const AUTO_MS = 4000;

/* ─── Safely encode image URLs (handles filenames with spaces) ─────────── */
const safeImgUrl = (url) => {
  if (!url) return null;
  try {
    // If already a valid encoded URL, return as-is
    return new URL(url).href.replace(/ /g, "%20");
  } catch {
    return url.replace(/ /g, "%20");
  }
};

/* ─── Placeholder for missing images ───────────────────────────────────── */
const placeholderUrl = (name) =>
  `https://placehold.co/600x800/f3f4f6/9ca3af?text=${encodeURIComponent(name || "Category")}`;

/* ─── Spotlight ───────────────────────────────────────────────────────── */
function SpotlightCard({ cat }) {
  return (
    <Link
      to={cat.link}
      className="cat-img-wrap relative block rounded-[24px] shadow-2xl overflow-hidden h-full w-full bg-gray-100"
      style={{ gridColumn: "1", gridRow: "1 / 3" }}
    >
      <img
        src={cat.image}
        alt={cat.name}
        className="cat-img block w-full h-full object-cover"
        loading="lazy"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = placeholderUrl(cat.name);
        }}
      />

      {/* Cinematic overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-7 lg:p-9 text-white z-10">
        <p className="text-xs font-semibold tracking-[0.15em] uppercase text-white/70 mb-2">
          Shop the collection
        </p>
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-5 drop-shadow-md">
          {cat.name}
        </h3>
        <span className="inline-flex items-center gap-2 bg-white text-gray-900 text-sm font-bold px-6 py-3 rounded-full hover:bg-gray-50 active:scale-95 transition-all shadow-lg">
          Shop Now
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}

/* ─── Mini Card ───────────────────────────────────────────────────────── */
function MiniCard({ cat, isActive }) {
  return (
    <Link
      to={cat.link}
      className={`mini-card ${isActive ? "ring-active" : ""} h-full block`}
      aria-label={`View ${cat.name}`}
    >
      {/* Background image */}
      <div className="absolute inset-0 bg-gray-100 overflow-hidden">
        <img
          src={cat.image}
          alt={cat.name}
          className="cat-img w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = placeholderUrl(cat.name);
          }}
        />
      </div>

      {/* Hover overlay */}
      <div className="mini-hover-layer">
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        <div className="relative w-full px-4 py-4 text-white z-10">
          <p className="text-xs sm:text-sm font-bold leading-snug tracking-wide line-clamp-1 truncate">{cat.name}</p>
        </div>
      </div>

      {/* Active pulse dot */}
      {isActive && (
        <div className="absolute top-3 right-3">
          <span className="pulse-dot block w-2.5 h-2.5 rounded-full bg-white shadow-lg" />
        </div>
      )}

      {/* Selected ring overlay tint */}
      {isActive && (
        <div className="absolute inset-0 bg-white/10 pointer-events-none" />
      )}
    </Link>
  );
}

/* ─── Main Component ──────────────────────────────────────────────────── */
export default function CategorySection({ className, sectionTitle = "Shop by Category" }) {
  const {
    categories: productCategories,
    fetchCategoriesOnly,
    loading: categoriesLoading,
    hasCategories,
  } = useProducts();

  const [activeIdx, setActiveIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const scrollRef = useRef(null);
  const sectionRef = useRef(null);
  const isInternalScroll = useRef(false);
  const scrollRafRef = useRef(null);

  /* Visibility Observer */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  /* Load categories */
  useEffect(() => {
    const load = async () => {
      try {
        if (!hasCategories || productCategories.length === 0) await fetchCategoriesOnly();
      } catch (e) {
        console.error("CategorySection:", e);
      }
    };
    load();
  }, [hasCategories, productCategories.length, fetchCategoriesOnly]);

  /* Transform */
  const displayCategories = (productCategories || [])
    .filter((c) => c && c.name)
    .map((c, i) => {
      const name = c.name.replace(/\.+$/, "").trim();
      // Use raw API URL (encode spaces) or fall back to placehold.co
      const rawUrl = c.image && c.image !== "null" ? safeImgUrl(c.image) : null;
      return {
        id: c.id,
        name,
        image: rawUrl || placeholderUrl(name),
        link: `/all-products?categoryId=${c.id}`,
        colorIdx: i,
      };
    });

  /* Auto-advance with smooth infinite transition */
  const goTo = useCallback((idx, isManual = false) => {
    setActiveIdx(idx);
    setAnimKey((k) => k + 1);

    if (scrollRef.current && displayCategories.length > 0) {
      const container = scrollRef.current;
      const items = container.children;
      const total = displayCategories.length;
      if (!items || items.length < total * 3) return;

      const firstItem = items[0];
      const secondItem = items[1];
      const itemW = firstItem && secondItem ? secondItem.offsetLeft - firstItem.offsetLeft : 150;
      const sectorW = itemW * total;

      // Find current center item
      const center = container.scrollLeft + container.offsetWidth / 2;
      let currentChildIdx = 0;
      let minD = Infinity;
      for (let i = 0; i < items.length; i++) {
        const d = Math.abs((items[i].offsetLeft + items[i].offsetWidth / 2) - center);
        if (d < minD) { minD = d; currentChildIdx = i; }
      }

      let targetChildIdx;
      if (isManual) {
        targetChildIdx = idx + total;
      } else {
        targetChildIdx = currentChildIdx + 1;
        while (targetChildIdx % total !== idx) {
          targetChildIdx++;
        }
      }

      // If target reaches upper boundary (Set 3), silently reset to Set 2 before scrolling
      if (targetChildIdx >= total * 2) {
        container.scrollLeft -= sectorW;
        targetChildIdx -= total;
      }

      if (targetChildIdx < items.length) {
        const targetItem = items[targetChildIdx];
        const targetLeft = targetItem.offsetLeft + (targetItem.offsetWidth / 2) - (container.offsetWidth / 2);
        
        isInternalScroll.current = true;
        container.scrollTo({
          left: targetLeft,
          behavior: "smooth"
        });
        
        setTimeout(() => { isInternalScroll.current = false; }, 550);
      }
    }
  }, [displayCategories.length]);

  /* ─────────────────────────────────────────────────────────────────────────
   * MOBILE INFINITE CAROUSEL — clean middle-sector implementation
   *
   * Layout:  [ copy A (sector 0) ][ copy B (sector 1) ][ copy C (sector 2) ]
   *           0…N-1               N…2N-1              2N…3N-1
   *
   * On mount → scroll to middle of sector 1 (copy B).
   * On swipe → only update activeIdx highlight; NO position teleport mid-swipe.
   * After finger lifts → if outside 25%–75% of total scroll width, silently
   *   reassign scrollLeft to the equivalent position in sector 1 (invisible).
   * ───────────────────────────────────────────────────────────────────────── */

  const isTouchingRef   = useRef(false);
  const wrapTimerRef    = useRef(null);
  const rafHighlightRef = useRef(null);

  /* Get pixel width of one sector (N items) */
  const getSectorWidth = useCallback(() => {
    const c = scrollRef.current;
    if (!c || c.children.length < 2) return 0;
    const a = c.children[0];
    const b = c.children[1];
    return (b.offsetLeft - a.offsetLeft) * displayCategories.length;
  }, [displayCategories.length]);

  /* Teleport to equivalent middle-sector position — called ONLY after finger lifts */
  const wrapToMiddle = useCallback(() => {
    const c = scrollRef.current;
    if (!c || displayCategories.length === 0) return;
    const sW = getSectorWidth();
    if (sW <= 0) return;
    const sl = c.scrollLeft;
    if (sl < sW * 0.5) {
      c.scrollLeft = sl + sW;          // jumped too far left → move right one sector
    } else if (sl > sW * 1.5) {
      c.scrollLeft = sl - sW;          // jumped too far right → move left one sector
    }
  }, [displayCategories.length, getSectorWidth]);

  /* onScroll — only updates activeIdx highlight; never moves scrollLeft */
  const handleScroll = useCallback((e) => {
    const c = e.target;
    const total = displayCategories.length;
    if (total === 0 || isInternalScroll.current) return;

    if (rafHighlightRef.current) cancelAnimationFrame(rafHighlightRef.current);
    rafHighlightRef.current = requestAnimationFrame(() => {
      const items   = c.children;
      const center  = c.scrollLeft + c.offsetWidth / 2;
      let bestIdx   = 0;
      let bestDist  = Infinity;
      for (let i = 0; i < items.length; i++) {
        const d = Math.abs(items[i].offsetLeft + items[i].offsetWidth / 2 - center);
        if (d < bestDist) { bestDist = d; bestIdx = i; }
      }
      const realIdx = bestIdx % total;
      if (realIdx !== activeIdx) setActiveIdx(realIdx);
    });
  }, [displayCategories.length, activeIdx]);

  /* Touch start — freeze auto-advance, cancel any pending wrap */
  const handleCarouselTouchStart = useCallback((e) => {
    e.stopPropagation();                  // don't trigger section-level onTouchStart
    isTouchingRef.current = true;
    setIsHovered(true);                   // pause auto-advance
    if (wrapTimerRef.current) clearTimeout(wrapTimerRef.current);
  }, []);

  /* Touch end — schedule wrap after momentum scroll settles */
  const handleCarouselTouchEnd = useCallback((e) => {
    e.stopPropagation();
    isTouchingRef.current = false;
    if (wrapTimerRef.current) clearTimeout(wrapTimerRef.current);
    wrapTimerRef.current = setTimeout(() => {
      wrapToMiddle();
      setIsHovered(false);               // resume auto-advance
    }, 450);
  }, [wrapToMiddle]);

  /* goTo — programmatic scroll to a specific real index inside sector 1 */
  const goToMobile = useCallback((idx) => {
    const c = scrollRef.current;
    if (!c || displayCategories.length === 0) return;
    const sW   = getSectorWidth();
    if (sW <= 0) return;
    const total = displayCategories.length;
    const items = c.children;
    // target item is always in sector 1 (middle copy): offset N + idx
    const targetItem = items[total + idx];
    if (!targetItem) return;
    const targetLeft = targetItem.offsetLeft + targetItem.offsetWidth / 2 - c.offsetWidth / 2;
    isInternalScroll.current = true;
    c.scrollTo({ left: targetLeft, behavior: 'smooth' });
    setTimeout(() => { isInternalScroll.current = false; }, 600);
  }, [displayCategories.length, getSectorWidth]);

  /* Mount: position at sector 1, index 0 centred */
  useEffect(() => {
    if (displayCategories.length === 0) return;
    const timer = setTimeout(() => {
      const c = scrollRef.current;
      if (!c) return;
      const total = displayCategories.length;
      const items = c.children;
      const target = items[total];        // sector-1, item 0
      if (!target) return;
      const left = target.offsetLeft + target.offsetWidth / 2 - c.offsetWidth / 2;
      c.scrollLeft = left;
    }, 150);
    return () => clearTimeout(timer);
  }, [displayCategories.length]);

  /* Auto-advance */
  useEffect(() => {
    if (displayCategories.length <= 1 || !isVisible || isHovered) return;
    const t = setTimeout(() => {
      const next = (activeIdx + 1) % displayCategories.length;
      setActiveIdx(next);
      setAnimKey((k) => k + 1);
      goToMobile(next);
    }, AUTO_MS);
    return () => clearTimeout(t);
  }, [activeIdx, displayCategories.length, isVisible, isHovered, goToMobile]);

  /* ── Skeleton ────────────────────────────────────────────────────────── */
  if (categoriesLoading) {
    return (
      <section className={`py-12 lg:py-20 ${className || ""}`}>
        <style>{STYLES}</style>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="w-24 h-3 bg-gray-100 rounded-full mx-auto mb-4 animate-pulse" />
            <div className="w-64 h-8 bg-gray-100 rounded-full mx-auto animate-pulse" />
          </div>
          <div
            className="grid gap-3 rounded-3xl overflow-hidden"
            style={{ gridTemplateColumns: "1.55fr 1fr 1fr", gridTemplateRows: "1fr 1fr", height: "560px" }}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 animate-pulse rounded-2xl"
                style={i === 0 ? { gridColumn: "1", gridRow: "1 / 3", animationDelay: "0s" } : { animationDelay: `${i * 0.08}s` }}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ── Empty ───────────────────────────────────────────────────────────── */
  if (displayCategories.length === 0) {
    return (
      <section className={`py-12 lg:py-20 ${className || ""}`}>
        <style>{STYLES}</style>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{sectionTitle}</h2>
          <p className="text-gray-500">No categories available at the moment.</p>
        </div>
      </section>
    );
  }

  const spotlight = displayCategories[activeIdx];
  /* Others = all except active; pad with null slots to always have 4 minis  */
  const minis = displayCategories.filter((_, i) => i !== activeIdx);
  const miniSlots = [...minis, null, null, null, null].slice(0, 4);

  /* Grid height by screen (controlled via inline style so it's crisp) */
  const GRID_H = "min(580px, 62vw)";

  return (
    <section
      ref={sectionRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`py-12 lg:py-20 overflow-x-hidden ${className || ""}`}
    >
      <style>{STYLES}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[11px] font-bold tracking-[0.22em] text-gray-400 uppercase">Collections</span>
            <Sparkles className="w-3.5 h-3.5 text-gray-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
            {sectionTitle}
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="h-px w-8 bg-gray-200 rounded-full" />
            <div className="h-1 w-14 bg-gray-900 rounded-full" />
            <div className="h-px w-8 bg-gray-200 rounded-full" />
          </div>
        </div>

        {/* ── Bento Grid (desktop) / Stack (mobile) ───────────────── */}
        {/* Bento Grid (desktop) */}
        <div className="hidden md:grid gap-3" style={{ gridTemplateColumns: "1.55fr 1fr 1fr", gridTemplateRows: "1fr 1fr", height: GRID_H }}>
          {/* Spotlight */}
          <SpotlightCard cat={spotlight} />

          {/* Mini cards – fill up to 4 slots */}
          {miniSlots.map((cat, i) =>
            cat ? (
              <MiniCard
                key={cat.id}
                cat={cat}
                isActive={cat.id === spotlight.id}
              />
            ) : (
              /* Empty filler slot */
              <div key={`empty-${i}`} className="rounded-[18px] bg-gray-50 border border-gray-100" />
            )
          )}
        </div>

        {/* ── Mobile layout: featured top + horizontal scrollable minis ── */}
        <div className="md:hidden space-y-7">
          {/* Featured (mobile) */}
          <Link
            to={spotlight.link}
            className="cat-img-wrap relative block rounded-2xl overflow-hidden shadow-xl bg-gray-100"
            style={{ height: "280px" }}
          >
            <img
              src={spotlight.image}
              alt={spotlight.name}
              className="cat-img"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = placeholderUrl(spotlight.name);
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
              <h3 className="text-xl font-bold mb-2">{spotlight.name}</h3>
              <span className="inline-flex items-center gap-1.5 bg-white text-gray-900 text-xs font-bold px-4 py-2 rounded-full">
                Shop Now <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>

          {/* Minis – infinite horizontal scroll (3× clone loop) */}
          {displayCategories.length > 1 && (
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              onTouchStart={handleCarouselTouchStart}
              onTouchEnd={handleCarouselTouchEnd}
              className="flex gap-4 overflow-x-auto pt-4 pb-6 scrollbar-hide no-scrollbar touch-carousel"
              style={{
                /* centre first visible item */
                paddingLeft:  'calc(50% - 60px)',
                paddingRight: 'calc(50% - 60px)',
              }}
            >
              {[...displayCategories, ...displayCategories, ...displayCategories].map((cat, i) => {
                const realIdx = i % displayCategories.length;
                return (
                  <Link
                    key={`${cat.id}-clone-${i}`}
                    to={cat.link}
                    onClick={(e) => {
                      // On tap: switch spotlight to this category; Link navigates on second tap
                      if (realIdx !== activeIdx) {
                        e.preventDefault();
                        setActiveIdx(realIdx);
                        setAnimKey((k) => k + 1);
                        goToMobile(realIdx);
                      }
                    }}
                    className={`mini-card flex-shrink-0 ${realIdx === activeIdx ? 'ring-active' : ''}`}
                    style={{ width: '120px', height: '110px' }}
                    draggable={false}
                  >
                    <div className="absolute inset-0 bg-gray-100 overflow-hidden">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="cat-img w-full h-full object-cover"
                        loading="lazy"
                        draggable={false}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = placeholderUrl(cat.name);
                        }}
                      />
                    </div>
                    <div className="mini-hover-layer">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                      <p className="relative w-full px-3 py-2.5 text-white text-[12px] font-bold leading-tight line-clamp-2 z-10">{cat.name}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Dot Navigation ───────────────────────────────────────── */}
        {displayCategories.length > 1 && (
          <div className="mt-6 flex flex-col items-center gap-3">

            {/* Dots */}
            <div className="flex items-center gap-2">
              {displayCategories.map((cat, i) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveIdx(i);
                    setAnimKey((k) => k + 1);
                    goToMobile(i);
                  }}
                  aria-label={`Go to ${cat.name}`}
                  className={`rounded-full transition-all duration-300 cursor-pointer ${
                    i === activeIdx
                      ? 'w-7 h-2.5 bg-gray-900'
                      : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            {/* Counter */}
            <p className="text-xs text-gray-400 font-medium">
              {activeIdx + 1} / {displayCategories.length}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}