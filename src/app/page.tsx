
"use client";

import { useEffect, useMemo, useState } from "react";

const products = [
  {
    id: 1,
    name: "Premium Wireless Earbuds",
    category: "Electronics",
    price: 2499,
    oldPrice: 3299,
    badge: "Best seller",
    image: "photo-1505740420928-5e560c06d30e",
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    category: "Electronics",
    price: 4999,
    oldPrice: 5999,
    badge: "Popular",
    image: "photo-1523275335684-37898b6baf30",
  },
  {
    id: 3,
    name: "Fast Charge Power Bank",
    category: "Electronics",
    price: 3499,
    oldPrice: null,
    badge: "",
    image: "photo-1609091839311-d5365f9ff1c5",
  },
  {
    id: 4,
    name: "Portable Bluetooth Speaker",
    category: "Electronics",
    price: 2999,
    oldPrice: null,
    badge: "Trending",
    image: "photo-1608043152269-423dbba4e7e1",
  },
  {
    id: 5,
    name: "Digital Air Fryer",
    category: "Home & Living",
    price: 8999,
    oldPrice: 10999,
    badge: "Save 18%",
    image: "photo-1556911220-e15b29be8c8f",
  },
  {
    id: 6,
    name: "Multi-purpose Blender",
    category: "Home & Living",
    price: 4499,
    oldPrice: null,
    badge: "",
    image: "photo-1570222094114-d054a817e56b",
  },
  {
    id: 7,
    name: "Electric Water Kettle",
    category: "Home & Living",
    price: 2199,
    oldPrice: null,
    badge: "",
    image: "photo-1594213114663-d94db9b1716b",
  },
  {
    id: 8,
    name: "Modern Desk Lamp",
    category: "Home & Living",
    price: 1899,
    oldPrice: null,
    badge: "",
    image: "photo-1507473885765-e6ed057f782c",
  },
  {
    id: 9,
    name: "Everyday Travel Backpack",
    category: "Fashion",
    price: 3499,
    oldPrice: null,
    badge: "New arrival",
    image: "photo-1553062407-98eeb64c6a62",
  },
  {
    id: 10,
    name: "Urban Casual Sneakers",
    category: "Fashion",
    price: 4999,
    oldPrice: 5999,
    badge: "",
    image: "photo-1542291026-7eec264c27ff",
  },
  {
    id: 11,
    name: "Classic Everyday Hoodie",
    category: "Fashion",
    price: 2799,
    oldPrice: null,
    badge: "",
    image: "photo-1556821840-3a63f95609a7",
  },
  {
    id: 12,
    name: "Stainless Steel Bottle",
    category: "Fashion",
    price: 1499,
    oldPrice: null,
    badge: "",
    image: "photo-1602143407151-7111542de6e8",
  },
  {
    id: 13,
    name: "Men's Grooming Kit",
    category: "Beauty",
    price: 3299,
    oldPrice: null,
    badge: "",
    image: "photo-1621607512214-68297480165e",
  },
  {
    id: 14,
    name: "Daily Skincare Essentials",
    category: "Beauty",
    price: 2499,
    oldPrice: null,
    badge: "Popular",
    image: "photo-1608248543803-ba4f8c70ae0b",
  },
  {
    id: 15,
    name: "Professional Hair Dryer",
    category: "Beauty",
    price: 3999,
    oldPrice: null,
    badge: "",
    image: "photo-1522338242992-e1a54906a8da",
  },
  {
    id: 16,
    name: "Electric Toothbrush",
    category: "Beauty",
    price: 2199,
    oldPrice: null,
    badge: "",
    image: "photo-1609840114035-3c981b782dfe",
  },
];

const categories = [
  "All products",
  "Electronics",
  "Fashion",
  "Home & Living",
  "Beauty",
];

const formatPrice = (price: number) =>
  `KSh ${price.toLocaleString("en-KE")}`;

type CartItem = {
  productId: number;
  quantity: number;
};

export default function Home() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All products");

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
const [isCartOpen, setIsCartOpen] = useState(false);
const [isCartHydrated, setIsCartHydrated] = useState(false);
// Restore saved cart after the component mounts
useEffect(() => {
  let restoredCart: CartItem[] = [];

  try {
    const savedCart = localStorage.getItem("mtaa-market-cart-v1");

    if (savedCart) {
      const parsed: unknown = JSON.parse(savedCart);

      if (Array.isArray(parsed)) {
        restoredCart = parsed.filter(
          (item): item is CartItem =>
            item !== null &&
            typeof item === "object" &&
            typeof item.productId === "number" &&
            Number.isInteger(item.productId) &&
            products.some((product) => product.id === item.productId) &&
            typeof item.quantity === "number" &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0
        );
      }
    }
  } catch (error) {
    console.error("Could not restore shopping cart:", error);
  }

  queueMicrotask(() => {
    setCartItems(restoredCart);
    setIsCartHydrated(true);
  });
}, []);

// Save cart whenever its contents change
useEffect(() => {
  if (!isCartHydrated) return;

  try {
    localStorage.setItem(
      "mtaa-market-cart-v1",
      JSON.stringify(cartItems)
    );
  } catch (error) {
    console.error("Could not save shopping cart:", error);
  }
}, [cartItems, isCartHydrated]);
  // Add a product to the cart
  const addToCart = (productId: number) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.productId === productId
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentItems, { productId, quantity: 1 }];
    });
  };

  // Update product quantity
  const updateQuantity = (productId: number, change: number) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Remove a product from the cart
  const removeFromCart = (productId: number) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.productId !== productId)
    );
  };

  // Calculate total cart quantity
  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Calculate cart subtotal
  const cartTotal = cartItems.reduce((total, item) => {
    const product = products.find(
      (product) => product.id === item.productId
    );

    return total + (product ? product.price * item.quantity : 0);
  }, 0);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "All products" ||
        product.category === activeCategory;

      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#191919]">
      {/* Announcement */}
      <div className="bg-[#191919] px-4 py-2 text-center text-xs font-medium text-white sm:text-sm">
        Welcome to Mtaa Market — Your everyday marketplace.
        <span className="ml-2 text-orange-300">
          Shop smart. Live better.
        </span>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#eae7e1] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <a href="#" className="shrink-0">
            <span className="text-2xl font-black tracking-tight">
              mtaa<span className="text-[#ed6a32]">.</span>
            </span>
            <span className="ml-1 text-xs font-semibold text-[#77746e]">
              MARKET
            </span>
          </a>

          <nav className="hidden items-center gap-7 text-sm font-medium text-[#555] md:flex">
            <a href="#products" className="hover:text-[#ed6a32]">
              Shop
            </a>
            <a href="#categories" className="hover:text-[#ed6a32]">
              Categories
            </a>
            <a href="#deals" className="hover:text-[#ed6a32]">
              Deals
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden text-xs font-medium text-[#77746e] sm:block">
              Kenya 🇰🇪
            </span>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label={`Shopping cart with ${cartCount} items`}
              className="relative flex items-center gap-2 rounded-full bg-[#191919] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#ed6a32]"
            >
              <span>Bag</span>
              <span>🛍️</span>
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ed6a32] px-1 text-[10px]">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Shopping Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close shopping cart"
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 h-full w-full bg-black/50"
          />

          {/* Cart Panel */}
          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-heading"
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
          >
            {/* Cart Header */}
            <div className="flex items-center justify-between border-b border-[#eae7e1] px-6 py-5">
              <div>
                <h2
                  id="cart-heading"
                  className="text-xl font-black"
                >
                  Your shopping bag
                </h2>
                <p className="mt-1 text-xs text-[#77746e]">
                  {cartCount} {cartCount === 1 ? "item" : "items"} in your bag
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                aria-label="Close cart"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3ef] text-xl transition hover:bg-[#ed6a32] hover:text-white"
              >
                ×
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {cartItems.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <span className="text-6xl">🛍️</span>

                  <h3 className="mt-5 text-lg font-bold">
                    Your bag is empty
                  </h3>

                  <p className="mt-2 max-w-xs text-sm leading-6 text-[#77746e]">
                    Looks like you haven&apos;t added anything yet. Explore our
                    collection and find something you love.
                  </p>

                  <button
                    type="button"
                    onClick={() => setIsCartOpen(false)}
                    className="mt-6 rounded-full bg-[#ed6a32] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#d95722]"
                  >
                    Continue shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {cartItems.map((item) => {
                    const product = products.find(
                      (product) => product.id === item.productId
                    );

                    if (!product) return null;

                    return (
                      <div
                        key={item.productId}
                        className="flex gap-4 border-b border-[#eae7e1] pb-5"
                      >
                        {/* Product Image */}
                        <div
                          role="img"
                          aria-label={product.name}
                          className="h-24 w-24 shrink-0 rounded-xl bg-[#f3f1ed] bg-cover bg-center"
                          style={{
                            backgroundImage: `url(https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=300&q=80)`,
                          }}
                        />

                        {/* Product Details */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-[#999]">
                                {product.category}
                              </p>

                              <h3 className="mt-1 text-sm font-bold leading-5">
                                {product.name}
                              </h3>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                removeFromCart(product.id)
                              }
                              aria-label={`Remove ${product.name}`}
                              className="text-lg text-[#999] transition hover:text-red-500"
                            >
                              ×
                            </button>
                          </div>

                          <p className="mt-2 text-sm font-black">
                            {formatPrice(product.price * item.quantity)}
                          </p>

                          {/* Quantity Controls */}
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-3 rounded-full border border-[#eae7e1] px-3 py-1">
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(product.id, -1)
                                }
                                aria-label={`Decrease ${product.name} quantity`}
                                className="font-bold hover:text-[#ed6a32]"
                              >
                                −
                              </button>

                              <span className="min-w-4 text-center text-xs font-bold">
                                {item.quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(product.id, 1)
                                }
                                aria-label={`Increase ${product.name} quantity`}
                                className="font-bold hover:text-[#ed6a32]"
                              >
                                +
                              </button>
                            </div>

                            <span className="text-[10px] text-[#999]">
                              {formatPrice(product.price)} each
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-[#eae7e1] bg-[#faf9f6] px-6 py-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#77746e]">
                    Subtotal
                  </span>

                  <span className="text-xl font-black">
                    {formatPrice(cartTotal)}
                  </span>
                </div>

                <p className="mt-2 text-xs text-[#77746e]">
                  Delivery charges will be calculated at checkout.
                </p>

                <button
                  type="button"
                  disabled
                  className="mt-5 w-full cursor-not-allowed rounded-full bg-[#191919]/50 px-6 py-4 text-sm font-bold text-white"
                >
                  Checkout coming next
                </button>

                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-3 w-full rounded-full border border-[#eae7e1] bg-white px-6 py-3 text-sm font-bold transition hover:border-[#ed6a32] hover:text-[#ed6a32]"
                >
                  Continue shopping
                </button>

                <p className="mt-4 text-center text-[10px] font-medium text-[#999]">
                  🇰🇪 Mtaa Market · M-Pesa checkout demonstration
                </p>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8 lg:pb-16 lg:pt-12">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#f5e9dc]">
          <div className="relative z-10 grid min-h-[400px] items-center gap-8 px-7 py-12 sm:px-12 lg:grid-cols-2 lg:px-16">
            <div className="max-w-xl">
              <span className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#ed6a32]">
                Your everyday marketplace
              </span>

              <h1 className="mt-6 text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                Good finds.
                <br />
                Great prices.
                <br />
                <span className="text-[#ed6a32]">Right here.</span>
              </h1>

              <p className="mt-5 max-w-md text-base leading-7 text-[#6b625a]">
                Discover the things you love, from everyday essentials
                to exciting new finds. Shopping made simple.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#products"
                  className="rounded-full bg-[#ed6a32] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#d95722]"
                >
                  Explore products →
                </a>

                <a
                  href="#categories"
                  className="rounded-full border border-[#d7c8b9] bg-white px-7 py-3.5 text-sm font-bold transition hover:bg-[#faf9f6]"
                >
                  Browse categories
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-5 text-xs font-semibold text-[#6b625a]">
                <span>✓ Quality picks</span>
                <span>✓ Convenient shopping</span>
                <span>✓ M-Pesa checkout demo</span>
              </div>
            </div>

            <div className="relative hidden h-[340px] lg:block">
              <div className="absolute right-4 top-5 h-64 w-64 rounded-full bg-[#ed6a32]/15" />

              <div className="absolute right-12 top-0 flex h-64 w-64 rotate-6 items-center justify-center rounded-[2rem] bg-white shadow-xl">
                <div className="text-center">
                  <div className="text-8xl">🎧</div>
                  <p className="mt-3 font-bold">Everyday tech</p>
                  <p className="text-sm text-[#77746e]">
                    Discover something new
                  </p>
                </div>
              </div>

              <div className="absolute bottom-2 left-5 flex h-36 w-36 -rotate-6 items-center justify-center rounded-3xl bg-[#191919] text-center text-white shadow-xl">
                <div>
                  <div className="text-5xl">⌚</div>
                  <p className="mt-2 text-sm font-bold">Live smarter</p>
                </div>
              </div>

              <div className="absolute bottom-0 right-3 rounded-full bg-white px-5 py-3 text-sm font-bold shadow-lg">
                Made for everyday life ✨
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 pb-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        {[
          ["🚚", "Convenient delivery", "To your doorstep"],
          ["💳", "M-Pesa ready", "Secure demo checkout"],
          ["✨", "Handpicked finds", "Everyday favourites"],
          ["🤝", "Shopping made easy", "Simple and reliable"],
        ].map(([icon, title, description]) => (
          <div
            key={title}
            className="rounded-2xl border border-[#eae7e1] bg-white p-4 sm:p-5"
          >
            <span className="text-2xl">{icon}</span>
            <h3 className="mt-3 text-sm font-bold">{title}</h3>
            <p className="mt-1 text-xs text-[#77746e]">{description}</p>
          </div>
        ))}
      </section>

      {/* Categories */}
      <section
        id="categories"
        className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-12 sm:px-6 lg:px-8"
      >
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ed6a32]">
            Explore
          </p>

          <h2 className="mt-2 text-2xl font-black sm:text-3xl">
            Shop by category
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Electronics", "🎧", "Tech for everyday life"],
            ["Fashion", "👟", "Find your style"],
            ["Home & Living", "🏡", "Make yourself at home"],
            ["Beauty", "✨", "Your daily essentials"],
          ].map(([category, icon, description]) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                setActiveCategory(category);
                document
                  .getElementById("products")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group rounded-2xl border border-[#eae7e1] bg-white p-5 text-left transition hover:-translate-y-1 hover:border-[#ed6a32] hover:shadow-md"
            >
              <span className="text-4xl">{icon}</span>
              <h3 className="mt-4 text-sm font-bold">{category}</h3>
              <p className="mt-1 text-xs text-[#77746e]">{description}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Products */}
      <section
        id="products"
        className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-20 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ed6a32]">
              The marketplace
            </p>

            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              Find your next favourite
            </h2>

            <p className="mt-2 text-sm text-[#77746e]">
              Explore our collection of everyday essentials.
            </p>
          </div>

          <div className="w-full sm:max-w-xs">
            <label htmlFor="product-search" className="sr-only">
              Search products
            </label>

            <input
              id="product-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products..."
              className="w-full rounded-full border border-[#eae7e1] bg-white px-5 py-3 text-sm outline-none transition placeholder:text-[#aaa] focus:border-[#ed6a32] focus:ring-2 focus:ring-[#ed6a32]/10"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mt-7 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-xs font-bold transition ${
                activeCategory === category
                  ? "bg-[#191919] text-white"
                  : "border border-[#eae7e1] bg-white text-[#555] hover:border-[#ed6a32]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="group overflow-hidden rounded-2xl border border-[#eae7e1] bg-white transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                role="img"
                aria-label={product.name}
                className="relative aspect-square overflow-hidden bg-[#f3f1ed] bg-cover bg-center transition duration-500 group-hover:scale-[1.01]"
                style={{
                  backgroundImage: `url(https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=700&q=85)`,
                }}
              >
                {product.badge && (
                  <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-[#ed6a32] shadow-sm">
                    {product.badge}
                  </span>
                )}
              </div>

              <div className="p-3 sm:p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#999]">
                  {product.category}
                </p>

                <h3 className="mt-2 min-h-10 text-sm font-bold leading-5">
                  {product.name}
                </h3>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-black">
                    {formatPrice(product.price)}
                  </span>

                  {product.oldPrice && (
                    <span className="text-xs text-[#999] line-through">
                      {formatPrice(product.oldPrice)}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => addToCart(product.id)}
                  className="mt-4 w-full rounded-full bg-[#191919] px-3 py-2.5 text-xs font-bold text-white transition hover:bg-[#ed6a32]"
                >
                  + Add to bag
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* No Products Found */}
        {filteredProducts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#d8d2c9] bg-white px-5 py-16 text-center">
            <p className="text-4xl">🔎</p>

            <h3 className="mt-4 text-lg font-bold">
              No products found
            </h3>

            <p className="mt-2 text-sm text-[#77746e]">
              Try another search or choose a different category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory("All products");
              }}
              className="mt-5 rounded-full bg-[#ed6a32] px-6 py-3 text-sm font-bold text-white"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* Deals Banner */}
      <section
        id="deals"
        className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-[#191919] p-8 text-white sm:flex-row sm:items-center sm:p-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ed6a32]">
              Shopping made simple
            </p>

            <h2 className="mt-3 max-w-xl text-2xl font-black sm:text-3xl">
              Your next great find is just a click away.
            </h2>

            <p className="mt-3 text-sm text-white/60">
              Explore the collection and discover something you love.
            </p>
          </div>

          <a
            href="#products"
            className="shrink-0 rounded-full bg-[#ed6a32] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#d95722]"
          >
            Shop the collection →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#eae7e1] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-4 py-9 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div>
            <span className="text-xl font-black">
              mtaa<span className="text-[#ed6a32]">.</span>
            </span>

            <p className="mt-1 text-xs text-[#77746e]">
              Your everyday marketplace in Kenya.
            </p>
          </div>

          <div className="text-xs text-[#77746e]">
            © 2026 Mtaa Market. Demo storefront.
          </div>

          <div className="text-xs font-semibold text-[#ed6a32]">
            M-Pesa sandbox demonstration
          </div>
        </div>
      </footer>
    </main>
  );
}