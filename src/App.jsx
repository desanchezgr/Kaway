import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Menu,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import "./App.css";

const products = [
  {
    id: 1,
    title: "Chaqueta Andina",
    type: "chaquetas",
    making: "manual",
    origin: "nacional",
    category: "Chaquetas / Perú",
    price: 240,
    tag: "Edición limitada",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh9Acnb5IgeFaC-D031HTVsmspPJoAaEiAiF9pc8Nltw&s=10",
    detail:
      "Algodón orgánico, forro de fibra de alpaca y cierres de latón envejecido.",
  },
  {
    id: 2,
    title: "Poncho Geométrico",
    type: "ponchos",
    making: "manual",
    origin: "nacional",
    category: "Ponchos / Perú",
    price: 310,
    tag: "Hecho a mano",
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85",
    detail:
      "Tejido por maestros artesanos en telar tradicional. Cada pieza es única.",
  },
  {
    id: 3,
    title: "Sobrecamisa de Lino",
    type: "camisas",
    making: "industrial",
    origin: "extranjero",
    category: "Camisas / Portugal",
    price: 165,
    tag: "Fibra natural",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85",
    detail:
      "Lino europeo de bajo impacto con una caída ligera y una silueta relajada.",
  },
  {
    id: 4,
    title: "Camiseta de Algodón Pima",
    type: "camisetas",
    making: "industrial",
    origin: "nacional",
    category: "Camisetas / Perú",
    price: 72,
    tag: "Esencial",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=85",
    detail:
      "Algodón Pima peruano de tacto suave, producido en talleres certificados.",
  },
  {
    id: 5,
    title: "Blusa Cobre",
    type: "blusas",
    making: "manual",
    origin: "nacional",
    category: "Blusas / Perú",
    price: 138,
    tag: "Serie artesanal",
    image:
      "https://images.unsplash.com/photo-1564257577054-8f9c5f5b9d4d?auto=format&fit=crop&w=1000&q=85",
    detail:
      "Blusa de caída fluida con detalles bordados a mano por artesanas locales.",
  },
  {
    id: 6,
    title: "Poncho de Cotopaxi",
    type: "ponchos",
    making: "manual",
    origin: "ecuador",
    category: "Ponchos / Ecuador",
    price: 285,
    tag: "Ecuador",
    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1000&q=85",
    detail:
      "Lana de oveja y alpaca tejida en telar de cintura en la sierra ecuatoriana.",
  },
  {
    id: 7,
    title: "Pantalón de Sarga",
    type: "pantalones",
    making: "industrial",
    origin: "nacional",
    category: "Pantalones / Perú",
    price: 154,
    tag: "Corte limpio",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1000&q=85",
    detail:
      "Sarga de algodón resistente con una silueta recta y cintura cómoda.",
  },
  {
    id: 8,
    title: "Blusa Otavalo",
    type: "blusas",
    making: "manual",
    origin: "ecuador",
    category: "Blusas / Ecuador",
    price: 196,
    tag: "Ecuador",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=85",
    detail: "Bordado floral inspirado en Otavalo, realizado puntada a puntada.",
  },
];

const collectionFilters = [
  {
    key: "type",
    label: "Prenda",
    options: [
      ["pantalones", "Pantalones"],
      ["camisetas", "Camisetas"],
      ["blusas", "Blusas"],
      ["camisas", "Camisas"],
      ["chaquetas", "Chaquetas"],
      ["ponchos", "Ponchos"],
    ],
  },
  {
    key: "making",
    label: "Confección",
    options: [
      ["manual", "Manual / artesanal"],
      ["industrial", "Industrial"],
    ],
  },
  {
    key: "origin",
    label: "Procedencia",
    options: [
      ["nacional", "Nacional"],
      ["extranjero", "Extranjero"],
      ["ecuador", "Ecuador"],
    ],
  },
];

const formatPrice = (amount) => `$${amount.toLocaleString("en-US")}`;

function ScrollVideoBackground() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let pauseTimer;
    let atelierIsVisible = false;

    const playWhileScrolling = () => {
      window.clearTimeout(pauseTimer);
      if (reduceMotion.matches) return;
      if (video.paused) video.play().catch(() => {});
      if (atelierIsVisible) return;
      pauseTimer = window.setTimeout(() => video.pause(), 180);
    };

    const atelier = document.getElementById("atelier");
    const atelierObserver = atelier
      ? new IntersectionObserver(
          ([entry]) => {
            atelierIsVisible = entry.isIntersecting;
            window.clearTimeout(pauseTimer);
            if (atelierIsVisible && !reduceMotion.matches) {
              video.play().catch(() => {});
            } else if (!atelierIsVisible) {
              video.pause();
            }
          },
          { threshold: 0.3 },
        )
      : null;
    if (atelier) atelierObserver?.observe(atelier);

    video.pause();
    window.addEventListener("scroll", playWhileScrolling, { passive: true });

    return () => {
      window.clearTimeout(pauseTimer);
      atelierObserver?.disconnect();
      window.removeEventListener("scroll", playWhileScrolling);
      video.pause();
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className="scroll-video-background"
      src="/poncho_viento_loop.mp4"
      muted
      playsInline
      loop
      preload="auto"
      aria-hidden="true"
    />
  );
}

const atelierColors = [
  { name: "Arcilla", value: "#b65d45" },
  { name: "Maíz", value: "#d2a45a" },
  { name: "Sage", value: "#536c5c" },
  { name: "Obsidiana", value: "#211f1c" },
  { name: "Marfil", value: "#e9e1d3" },
];

const atelierPatterns = [
  { name: "Liso", value: "solid" },
  { name: "Andino", value: "andino" },
  { name: "Rayas", value: "stripes" },
];

function PonchoModel({ color, pattern }) {
  const { scene } = useGLTF("/models/poncho.glb");
  const patternTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 180;
    canvas.height = 180;
    const context = canvas.getContext("2d");
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);

    if (pattern === "andino") {
      context.strokeStyle = "#d2a45a";
      context.lineWidth = 12;
      for (let index = -180; index < 360; index += 36) {
        context.beginPath();
        context.moveTo(index, 0);
        context.lineTo(index + 180, 180);
        context.stroke();
      }
    }

    if (pattern === "stripes") {
      context.fillStyle = "rgba(255, 255, 255, .2)";
      for (let index = 0; index < 180; index += 30) {
        context.fillRect(index, 0, 12, 180);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [color, pattern]);

  useEffect(() => {
    scene.traverse((child) => {
      if (!child.isMesh) return;
      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material];

      materials.forEach((material) => {
        material.color.set(color);
        material.map = pattern === "solid" ? null : patternTexture;
        material.needsUpdate = true;
      });
    });
  }, [scene, color, pattern, patternTexture]);

  return <primitive object={scene} scale={2.4} position={[0, 0, 0]} />;
}

// Precarga del modelo para mejor rendimiento
useGLTF.preload("/models/poncho.glb");

class ModelErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="model-placeholder">
          <span>Atelier 3D</span>
          <strong>Tu poncho aparecerá aquí</strong>
          <p>
            Copia el archivo en <code>public/models/poncho.glb</code>
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

function AtelierCustomizer() {
  const [color, setColor] = useState(atelierColors[0].value);
  const [pattern, setPattern] = useState(atelierPatterns[0].value);

  return (
    <section className="customizer section-wrap" id="personaliza">
      <div className="customizer-heading">
        <div>
          <p className="eyebrow">Kaway Atelier / En desarrollo</p>
          <h2>
            Tu poncho,
            <br />
            <em>tu lenguaje.</em>
          </h2>
        </div>
        <p>
          Explora la silueta en 3D. Gírala, acércala y encuentra una combinación
          de color y textura que te represente.
        </p>
      </div>
      <div className="customizer-layout">
        <div className="model-stage">
          <ModelErrorBoundary>
            <Canvas camera={{ position: [0, 0, 6], fov: 35 }}>
              <ambientLight intensity={1.8} />
              <directionalLight position={[3, 5, 4]} intensity={2.2} />
              <Suspense fallback={null}>
                <PonchoModel color={color} pattern={pattern} />
                <Environment preset="studio" />
              </Suspense>
              <OrbitControls
                enablePan={false}
                minDistance={3.5}
                maxDistance={8}
              />
            </Canvas>
          </ModelErrorBoundary>
          <span className="stage-caption">
            Arrastra para girar / rueda para acercar
          </span>
        </div>
        <aside className="customizer-controls">
          <div className="control-block">
            <p className="control-label">01 / Color base</p>
            <div className="swatches">
              {atelierColors.map((item) => (
                <button
                  className={color === item.value ? "swatch active" : "swatch"}
                  style={{ background: item.value }}
                  onClick={() => setColor(item.value)}
                  aria-label={item.name}
                  key={item.value}
                />
              ))}
            </div>
            <span className="control-value">
              {atelierColors.find((item) => item.value === color)?.name}
            </span>
          </div>
          <div className="control-block">
            <p className="control-label">02 / Patrón textil</p>
            <div className="pattern-options">
              {atelierPatterns.map((item) => (
                <button
                  className={
                    pattern === item.value
                      ? "pattern-option active"
                      : "pattern-option"
                  }
                  onClick={() => setPattern(item.value)}
                  key={item.value}
                >
                  <span className={`pattern-preview ${item.value}`} />
                  {item.name}
                </button>
              ))}
            </div>
          </div>
          <div className="customizer-note">
            <Sparkles size={15} />
            <p>
              La personalización final se realiza a mano en nuestro atelier,
              respetando la caída y la textura de cada tejido.
            </p>
          </div>
          <button className="primary-button customizer-button">
            Solicitar esta pieza <ArrowRight size={16} />
          </button>
        </aside>
      </div>
    </section>
  );
}

function CartPage({ cart, onBack, onRemove, onChangeQuantity }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="cart-page section-wrap">
      <button className="back-link" onClick={onBack}>
        <ArrowLeft size={16} /> Volver a la colección
      </button>
      <div className="cart-heading">
        <div>
          <p className="eyebrow">
            Tu selección / {itemCount} {itemCount === 1 ? "pieza" : "piezas"}
          </p>
          <h1>Tu carrito.</h1>
        </div>
        <p>Envío gratuito en pedidos superiores a $150</p>
      </div>
      {cart.length === 0 ? (
        <div className="empty-cart">
          <ShoppingBag size={30} strokeWidth={1} />
          <h2>Tu carrito está vacío.</h2>
          <p>Descubre piezas creadas para acompañarte durante años.</p>
          <button className="primary-button" onClick={onBack}>
            Explorar colección <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cart.map((item) => (
              <article className="cart-item" key={item.id}>
                <img src={item.image} alt={item.title} />
                <div className="cart-item-info">
                  <p>{item.category}</p>
                  <h2>{item.title}</h2>
                  <button
                    className="remove-button"
                    onClick={() => onRemove(item.id)}
                  >
                    Eliminar
                  </button>
                </div>
                <div className="cart-item-actions">
                  <strong>{formatPrice(item.price * item.quantity)}</strong>
                  <div className="quantity-control">
                    <button
                      onClick={() => onChangeQuantity(item.id, -1)}
                      aria-label="Reducir cantidad"
                    >
                      <Minus size={13} />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => onChangeQuantity(item.id, 1)}
                      aria-label="Aumentar cantidad"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <aside className="cart-summary">
            <p className="eyebrow">Resumen del pedido</p>
            <div>
              <span>Subtotal</span>
              <strong>{formatPrice(total)}</strong>
            </div>
            <div>
              <span>Envío</span>
              <strong>{total >= 150 ? "Gratis" : "$12"}</strong>
            </div>
            <hr />
            <div className="summary-total">
              <span>Total</span>
              <strong>{formatPrice(total < 150 ? total + 12 : total)}</strong>
            </div>
            <button className="primary-button checkout-button">
              Finalizar compra <ArrowRight size={16} />
            </button>
            <small>Impuestos calculados en el checkout.</small>
          </aside>
        </div>
      )}
    </main>
  );
}

function App() {
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [collectionArrival, setCollectionArrival] = useState(false);
  const [filters, setFilters] = useState({ type: [], making: [], origin: [] });
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [view, setView] = useState("shop");
  const visibleProducts = products.filter((product) =>
    Object.entries(filters).every(
      ([key, values]) => values.length === 0 || values.includes(product[key]),
    ),
  );
  const visibleProductIds = visibleProducts.map((product) => product.id).join(",");

  const scrollToCollection = (event) => {
    event.preventDefault();
    const collection = document.getElementById("coleccion");
    if (!collection) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const top = collection.getBoundingClientRect().top + window.scrollY - 18;
    window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
    window.history.replaceState(null, "", "#coleccion");
    setCollectionArrival(false);
    window.setTimeout(() => setCollectionArrival(true), reduceMotion ? 0 : 650);
    window.setTimeout(() => setCollectionArrival(false), reduceMotion ? 100 : 1800);
  };

  useEffect(() => {
    AOS.init({
      duration: 650,
      easing: "ease-out-cubic",
      once: true,
      offset: 80,
    });
  }, []);

  useEffect(() => {
    AOS.refreshHard();
  }, [visibleProductIds]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const activeFilterCount = Object.values(filters).reduce(
    (total, values) => total + values.length,
    0,
  );
  const updateFilter = (key, value) =>
    setFilters((current) => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((item) => item !== value)
        : [...current[key], value],
    }));
  const resetFilters = () => setFilters({ type: [], making: [], origin: [] });

  const addToCart = (product) =>
    setCart((items) => {
      const existing = items.find((item) => item.id === product.id);
      if (existing)
        return items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      return [...items, { ...product, quantity: 1 }];
    });
  const changeQuantity = (id, amount) =>
    setCart((items) =>
      items
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + amount } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  const removeFromCart = (id) =>
    setCart((items) => items.filter((item) => item.id !== id));

  return (
    <div className="site-shell">
      <ScrollVideoBackground />
      <div className="announcement">
        <span>Envío gratuito en pedidos superiores a $150</span>
        <span>·</span>
        <span>Diseñado en Lima, tejido en los Andes</span>
      </div>
      <header className="navbar">
        <button className="brand brand-button" onClick={() => setView("shop")}>
          Kaway<span>®</span>
        </button>
        <nav className={menuOpen ? "nav-links is-open" : "nav-links"}>
          <div className="collection-menu">
            <button
              className="collection-trigger"
              onClick={() => setCollectionOpen(!collectionOpen)}
              aria-expanded={collectionOpen}
            >
              Colección{" "}
              <ChevronDown
                size={14}
                className={collectionOpen ? "rotate-icon" : ""}
              />
              {activeFilterCount > 0 && <b>{activeFilterCount}</b>}
            </button>
            {collectionOpen && (
              <div className="collection-dropdown">
                <div className="dropdown-intro">
                  <span>Explora Kaway</span>
                  <p>Elige una o varias categorías para encontrar tu pieza.</p>
                </div>
                <div className="collection-groups">
                  {collectionFilters.map((filter) => (
                    <section className="collection-group" key={filter.key}>
                      <h3>{filter.label}</h3>
                      <div className="collection-options">
                        {filter.options.map(([value, label]) => (
                          <button
                            className={
                              filters[filter.key].includes(value)
                                ? "selected"
                                : ""
                            }
                            onClick={() => updateFilter(filter.key, value)}
                            key={value}
                            aria-pressed={filters[filter.key].includes(value)}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
                <div className="dropdown-footer">
                  <span>{visibleProducts.length} piezas encontradas</span>
                  <button onClick={resetFilters}>Restablecer selección</button>
                </div>
              </div>
            )}
          </div>
          <a href="#herencia" onClick={() => setMenuOpen(false)}>
            Herencia textil
          </a>
          <a href="#atelier" onClick={() => setMenuOpen(false)}>
            El atelier
          </a>
        </nav>
        <button
          className="bag-button"
          onClick={() => setView("cart")}
          aria-label="Abrir carrito"
        >
          <ShoppingBag size={18} strokeWidth={1.5} />
          <span>Carrito</span>
          <b>{cartCount}</b>
        </button>
        <button
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {view === "cart" ? (
        <CartPage
          cart={cart}
          onBack={() => setView("shop")}
          onRemove={removeFromCart}
          onChangeQuantity={changeQuantity}
        />
      ) : (
        <>
          <main>
            <section className="hero" id="inicio">
              <div className="hero-copy reveal">
                <p className="eyebrow">
                  <Sparkles size={13} /> Vanguardia & raíz ancestral
                </p>
                <h1>
  <span className="title-line">El hilo del tiempo,</span>
  <br />
  <em className="title-line delay-1">reimaginado.</em>
</h1>
                <p className="hero-intro">
                  Una conversación entre la sastrería contemporánea y los
                  patrones que han viajado por generaciones.
                </p>
                <a href="#coleccion" className="primary-button" onClick={scrollToCollection}>
                  Explorar catálogo <ArrowRight size={16} />
                </a>
                <p className="hero-note">
                  Temporada 01 / Geometría de los Andes
                </p>
              </div>
              <div className="hero-image reveal-delay">
                <img
                  src="/images/andino.jpg"
                  alt="Modelo vistiendo una silueta Kaway"
                />
                <div className="image-caption">
                  <span>01—03</span>
                  <span>Materia en movimiento</span>
                </div>
              </div>
            </section>


<div class="card">
  <section class="landscape-section">
    <div class="sky"></div>
    <div class="sun"></div>
    <div class="hill-1"></div>
    <div class="hill-2"></div>
    <div class="ocean">
      <div class="reflection"></div>
      <div class="reflection"></div>
      <div class="reflection"></div>
      <div class="reflection"></div>
      <div class="reflection"></div>
      <div class="shadow-hill-1"></div>
      <div class="shadow-hill-2"></div>
    </div>
    <div class="hill-3"></div>
    <div class="hill-4"></div>
    <div class="tree-1">
      <svg
        stroke-width="0.00064"
        stroke="#b77873"
        fill="#b77873"
        xml:space="preserve"
        viewBox="0 0 64.00 64.00"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        xmlns="http://www.w3.org/2000/svg"
        id="Layer_1"
        version="1.0"
      >
        <g stroke-width="0" id="SVGRepo_bgCarrier"></g>
        <g
          stroke-linejoin="round"
          stroke-linecap="round"
          id="SVGRepo_tracerCarrier"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <path
            d="M32,0C18.148,0,12,23.188,12,32c0,9.656,6.883,17.734,16,19.594V60c0,2.211,1.789,4,4,4s4-1.789,4-4v-8.406 C45.117,49.734,52,41.656,52,32C52,22.891,46.051,0,32,0z"
            fill="#b77873"
          ></path>
        </g>
      </svg>
    </div>
    <div class="tree-2">
      <svg
        stroke-width="0.00064"
        stroke="#b77873"
        fill="#b77873"
        xml:space="preserve"
        viewBox="0 0 64.00 64.00"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        xmlns="http://www.w3.org/2000/svg"
        id="Layer_1"
        version="1.0"
      >
        <g stroke-width="0" id="SVGRepo_bgCarrier"></g>
        <g
          stroke-linejoin="round"
          stroke-linecap="round"
          id="SVGRepo_tracerCarrier"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <path
            d="M32,0C18.148,0,12,23.188,12,32c0,9.656,6.883,17.734,16,19.594V60c0,2.211,1.789,4,4,4s4-1.789,4-4v-8.406 C45.117,49.734,52,41.656,52,32C52,22.891,46.051,0,32,0z"
            fill="#b77873"
          ></path>
        </g>
      </svg>
    </div>
    <div class="tree-3">
      <svg
        version="1.0"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 64.00 64.00"
        xml:space="preserve"
        fill="#a16773"
        stroke="#a16773"
        stroke-width="0.00064"
      >
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <path
            fill="#a16773"
            d="M32,0C18.148,0,12,23.188,12,32c0,9.656,6.883,17.734,16,19.594V60c0,2.211,1.789,4,4,4s4-1.789,4-4v-8.406 C45.117,49.734,52,41.656,52,32C52,22.891,46.051,0,32,0z"
          ></path>
        </g>
      </svg>
    </div>
    <div class="filter"></div>
  </section>

  <section class="content-section">
    <div class="weather-info">
      <div class="left-side">
        <div class="icon">
          <svg
            stroke="#000000"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <g stroke-width="0" id="SVGRepo_bgCarrier"></g>
            <g
              stroke-linejoin="round"
              stroke-linecap="round"
              id="SVGRepo_tracerCarrier"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                stroke-linecap="round"
                stroke-width="1.5"
                stroke="#ffffff"
                d="M22 14.3529C22 17.4717 19.4416 20 16.2857 20H11M14.381 9.02721C14.9767 8.81911 15.6178 8.70588 16.2857 8.70588C16.9404 8.70588 17.5693 8.81468 18.1551 9.01498M7.11616 11.6089C6.8475 11.5567 6.56983 11.5294 6.28571 11.5294C3.91878 11.5294 2 13.4256 2 15.7647C2 18.1038 3.91878 20 6.28571 20H7M7.11616 11.6089C6.88706 10.9978 6.7619 10.3369 6.7619 9.64706C6.7619 6.52827 9.32028 4 12.4762 4C15.4159 4 17.8371 6.19371 18.1551 9.01498M7.11616 11.6089C7.68059 11.7184 8.20528 11.9374 8.66667 12.2426M18.1551 9.01498C18.8381 9.24853 19.4623 9.60648 20 10.0614"
              ></path>
            </g>
          </svg>
        </div>
        <p>Cloudy</p>
      </div>
      <div class="right-side">
        <div class="location">
          <div>
            <svg
              version="1.0"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              width="64px"
              height="64px"
              viewBox="0 0 64 64"
              xml:space="preserve"
              fill="#ffffff"
              stroke="#ffffff"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  fill="#ffffff"
                  d="M32,0C18.746,0,8,10.746,8,24c0,5.219,1.711,10.008,4.555,13.93c0.051,0.094,0.059,0.199,0.117,0.289l16,24 C29.414,63.332,30.664,64,32,64s2.586-0.668,3.328-1.781l16-24c0.059-0.09,0.066-0.195,0.117-0.289C54.289,34.008,56,29.219,56,24 C56,10.746,45.254,0,32,0z M32,32c-4.418,0-8-3.582-8-8s3.582-8,8-8s8,3.582,8,8S36.418,32,32,32z"
                ></path>
              </g>
            </svg>
            <span>Spain</span>
          </div>
        </div>
        <p>Monday, 4th May</p>
        <p class="temperature">24°C</p>
      </div>
    </div>
    <div class="forecast">
      <div>
        <p>Tuesday, 5th May</p>
        <p>24°C</p>
      </div>
      <div class="separator"></div>
      <div>
        <p>Wednesday, 6th May</p>
        <p>26°C</p>
      </div>
      <div class="separator"></div>
      <div>
        <p>Thursday, 7th May</p>
        <p>22°C</p>
      </div>
    </div>
  </section>
</div>


            <section className={`collection section-wrap${collectionArrival ? " collection-arrival" : ""}`} id="coleccion">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Curaduría exclusiva</p>
                  <h2>Siluetas & texturas</h2>
                </div>
                <button
                  className="catalog-button"
                  onClick={() => setCollectionOpen(true)}
                >
                  Explorar categorías <ArrowRight size={14} />
                </button>
              </div>
              <div className="active-filters">
                {activeFilterCount > 0 ? (
                  <>
                    <span>Selección:</span>
                    {Object.entries(filters).flatMap(([key, values]) =>
                      values.map((value) => (
                        <button
                          key={`${key}-${value}`}
                          onClick={() => updateFilter(key, value)}
                        >
                          {value} <X size={11} />
                        </button>
                      )),
                    )}
                  </>
                ) : (
                  <span>Selección de prendas artesanales y contemporáneas</span>
                )}
              </div>
              <div className="product-grid">
                {visibleProducts.map((product, index) => (
                  <article
                    className="product-card"
                    key={product.id}
                    data-aos="fade-down"
                    data-aos-delay={index * 100}
                  >
                    <button
                      className="product-image"
                      onClick={() => setSelectedProduct(product)}
                      aria-label={`Ver ${product.title}`}
                    >
                      <span>{product.tag}</span>
                      <img src={product.image} alt={product.title} />
                      <i>
                        <Plus size={18} />
                      </i>
                    </button>
                    <div className="product-meta">
                      <div>
                        <p>{product.category}</p>
                        <h3>{product.title}</h3>
                      </div>
                      <strong>{formatPrice(product.price)}</strong>
                    </div>
                    <button
                      className="add-button"
                      onClick={() => addToCart(product)}
                    >
                      Añadir al carrito <ArrowRight size={14} />
                    </button>
                  </article>
                ))}
              </div>
              {visibleProducts.length === 0 && (
                <div className="no-results">
                  <h3>No encontramos piezas con estos filtros.</h3>
                  <button className="text-link" onClick={resetFilters}>
                    Ver toda la colección <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </section>
            <section className="heritage section-wrap" id="herencia">
              <div className="heritage-art">
                <video
                  className="heritage-video"
                  src="/poncho_viento_loop.mp4"
                  poster="/images/patron.avif"
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-hidden="true"
                />
                <div className="woven-pattern" />
                <span>
                  Tejido andino
                  <br />
                  Ecuador / Imbabura
                </span>
              </div>
              <div className="heritage-copy">
                <p className="eyebrow">El origen importa</p>
                <h2>
                  Lo que perdura
                  <br />
                  <em>toma nuevas formas.</em>
                </h2>
                <p>
                  Trabajamos junto a comunidades de tejedores para que cada
                  prenda sostenga una historia. La tradición no es un archivo:
                  es una materia viva, capaz de dialogar con el presente.
                </p>
                <a href="#atelier" className="text-link">
                  Conoce nuestra práctica <ArrowRight size={16} />
                </a>
              </div>
            </section>
            <AtelierCustomizer />
            <section className="atelier section-wrap" id="atelier">
              <p className="eyebrow">Kaway Atelier</p>
              <h2>Hecho para quedarse.</h2>
              <div className="atelier-line">
                <p>
                  Materiales honestos. Ritmos lentos. Prendas para habitar el
                  tiempo.
                </p>
                <ChevronDown size={20} />
              </div>
            </section>
          </main>
          <footer>
            <button
              className="brand brand-button"
              onClick={() => setView("shop")}
            >
              Kaway<span>®</span>
            </button>
            <p>Vestir el tiempo con intención.</p>
            <div>
              <a href="#contacto">Contacto</a>
              <a href="#privacidad">Privacidad</a>
              <a href="#instagram">Instagram</a>
            </div>
            <small>© 2026 Kaway Studio</small>
          </footer>
        </>
      )}
      {selectedProduct && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="product-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="close-button"
              onClick={() => setSelectedProduct(null)}
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>
            <img src={selectedProduct.image} alt={selectedProduct.title} />
            <div className="modal-copy">
              <p className="eyebrow">{selectedProduct.category}</p>
              <h2>{selectedProduct.title}</h2>
              <strong>{formatPrice(selectedProduct.price)}</strong>
              <p>{selectedProduct.detail}</p>
              <button
                className="primary-button"
                onClick={() => {
                  addToCart(selectedProduct);
                  setSelectedProduct(null);
                }}
              >
                Añadir al carrito <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
