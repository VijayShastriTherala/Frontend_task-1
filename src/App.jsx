import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { ArrowDown, ArrowLeft, ArrowRight, Camera, Check, ChevronDown, Headphones, Heart, Menu, Minus, Plus, Search, ShoppingBag, Sparkles, Star, Truck, UserRound, X, Zap } from 'lucide-react';
import { categories, formatPrice, products } from './data/products';

const readStore = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
};

function App() {
  const [cart, setCart] = useState(() => readStore('sonora-cart', []));
  const [saved, setSaved] = useState(() => readStore('sonora-saved', []));
  const [user, setUser] = useState(() => readStore('sonora-user', null));
  const [toast, setToast] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const showToast = (message) => { setToast(message); window.clearTimeout(window.toastTimer); window.toastTimer = window.setTimeout(() => setToast(''), 2600); };

  useEffect(() => { localStorage.setItem('sonora-cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('sonora-saved', JSON.stringify(saved)); }, [saved]);
  useEffect(() => { if (user) localStorage.setItem('sonora-user', JSON.stringify(user)); else localStorage.removeItem('sonora-user'); }, [user]);
  useEffect(() => { setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }, [location.pathname]);

  const addToCart = (product, quantity = 1) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      return existing ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item) : [...current, { ...product, quantity }];
    });
    showToast(`${product.name} added to your bag`);
  };
  const changeQuantity = (id, amount) => setCart((current) => current.map((item) => item.id === id ? { ...item, quantity: item.quantity + amount } : item).filter((item) => item.quantity > 0));
  const toggleSaved = (product) => {
    const exists = saved.includes(product.id);
    setSaved((current) => exists ? current.filter((id) => id !== product.id) : [...current, product.id]);
    showToast(exists ? 'Removed from your wishlist' : 'Saved to your wishlist');
  };

  return <>
    <div className="announcement"><span>GOOD SOUND. BETTER DAYS.</span><span>Free shipping on orders over ₹1,999 <ArrowRight size={13} /></span></div>
    <header className="site-header">
      <Link to="/" className="wordmark" aria-label="Sonora home">sonora<span>®</span></Link>
      <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
        <NavLink to="/shop" onClick={() => setMenuOpen(false)}>Shop all</NavLink>
        <a href="/#story" onClick={() => setMenuOpen(false)}>Our sound</a>
        <a href="/#journal" onClick={() => setMenuOpen(false)}>The journal</a>
      </nav>
      <div className="header-actions">
        <Link to="/account" className="icon-link account-link" aria-label="Your account"><UserRound size={19} /><span className="action-label">Account</span></Link>
        <Link to="/cart" className="icon-link bag-link" aria-label={`Shopping bag, ${cartCount} items`}><ShoppingBag size={19} /><span className="action-label">Bag</span>{cartCount > 0 && <span className="bag-count">{cartCount}</span>}</Link>
        <button className="icon-button menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
      </div>
    </header>

    <main className="page-enter" key={location.pathname}><Routes>
      <Route path="/" element={<Home addToCart={addToCart} toggleSaved={toggleSaved} saved={saved} showToast={showToast} />} />
      <Route path="/shop" element={<Shop addToCart={addToCart} toggleSaved={toggleSaved} saved={saved} />} />
      <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} toggleSaved={toggleSaved} saved={saved} />} />
      <Route path="/cart" element={<Cart cart={cart} changeQuantity={changeQuantity} showToast={showToast} />} />
      <Route path="/account" element={<Account user={user} setUser={setUser} showToast={showToast} />} />
      <Route path="*" element={<NotFound />} />
    </Routes></main>

    <Footer showToast={showToast} />
    {toast && <div className="toast" role="status"><span className="toast-check"><Check size={15} /></span>{toast}</div>}
  </>;
}

function ProductCard({ product, addToCart, toggleSaved, saved }) {
  return <article className="product-card">
    <div className={`product-image-wrap tone-${product.tone}`}>
      <Link to={`/product/${product.id}`} className="product-image-link" aria-label={`View ${product.name}`}><img src={product.image} alt={product.name} loading="lazy" /></Link>
      <span className="product-tag">{product.tag}</span>
      <button className={`save-button ${saved.includes(product.id) ? 'is-saved' : ''}`} onClick={() => toggleSaved(product)} aria-label={saved.includes(product.id) ? 'Remove from wishlist' : 'Save to wishlist'}><Heart size={18} fill={saved.includes(product.id) ? 'currentColor' : 'none'} /></button>
      <button className="quick-add" onClick={() => addToCart(product)}><Plus size={16} /> Quick add</button>
    </div>
    <div className="product-meta"><div><Link className="product-name" to={`/product/${product.id}`}>{product.name}</Link><span className="product-color">{product.color}</span></div><span className="product-price">{formatPrice(product.price)}</span></div>
    <div className="product-rating"><Star size={12} fill="currentColor" /><span>{product.rating}</span><span className="rating-count">({product.reviews})</span></div>
  </article>;
}

function ProductGrid({ items, ...props }) {
  if (!items.length) return <div className="empty-state">No gear in this frequency. Try another search.</div>;
  return <div className="product-grid">{items.map((product) => <ProductCard key={product.id} product={product} {...props} />)}</div>;
}

function Home({ addToCart, toggleSaved, saved, showToast }) {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);
  return <>
    <section className="hero">
      <div className="hero-copy"><p className="eyebrow"><span className="eyebrow-dot" /> MADE FOR YOUR EVERYDAY EXTRA</p><h1>Sound that<br />moves <span>you.</span></h1><p className="hero-description">Less noise. More you. Meet the next generation of personal audio, made to go wherever your day takes you.</p><div className="hero-buttons"><Link to="/shop" className="button button-dark">Find your frequency <ArrowRight size={16} /></Link><a href="#bestsellers" className="text-link">Meet the lineup <ArrowDown size={15} /></a></div><div className="hero-proof"><div className="proof-stars">★★★★★</div><span>Loved by 40,000+ listeners</span></div></div>
      <div className="hero-art"><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><span className="hero-sticker">YOUR<br />WORLD.<br /><b>YOUR<br />SOUND.</b></span><img className="hero-product" src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1400&q=90" alt="Black over-ear headphones" /><div className="hero-caption"><span>01 / THE PULSE PRO</span><span>BUILT FOR THE BIG MOMENTS</span></div><div className="hero-art-number">S—01</div></div>
      <div className="hero-side-note">IN YOUR ELEMENT · IN YOUR ELEMENT ·</div>
    </section>

    <section className="trust-strip"><div><Truck size={18} /><span>Free delivery over ₹1,999</span></div><div><Zap size={18} /><span>Made for everyday energy</span></div><div><Check size={18} /><span>Easy 7-day returns</span></div><div><Headphones size={18} /><span>Real people, real support</span></div></section>

    <section className="section featured-section" id="bestsellers"><div className="section-heading"><div><p className="eyebrow">THE CROWD PLEASERS</p><h2>Good things, <span>on repeat.</span></h2></div><Link to="/shop" className="text-link">Shop all gear <ArrowRight size={15} /></Link></div><ProductGrid items={products.slice(0, 4)} addToCart={addToCart} toggleSaved={toggleSaved} saved={saved} /></section>

    <section className="manifesto" id="story"><div className="manifesto-image"><img src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=85" alt="Listener immersed in their music" loading="lazy" /><span className="image-caption">A LITTLE MORE YOU, EVERY DAY.</span></div><div className="manifesto-copy"><p className="eyebrow">OUR KIND OF FREQUENCY</p><h2>Not just what<br />you hear.<br /><span>How you feel.</span></h2><p>We make good audio for the real, wonderfully unscripted soundtrack of your life. The slow mornings. The too-loud choruses. The one-more-song walks.</p><Link to="/shop" className="button button-light">Find your sound <ArrowRight size={16} /></Link><span className="manifesto-mark">s.</span></div></section>

    <section className="newsletter" id="journal"><div><p className="eyebrow">A NOTE FROM THE GOOD SIDE</p><h2>A little good<br />in your inbox.</h2><p>New drops, playlists, and the occasional excuse to take the long way home.</p></div><form className="newsletter-form" onSubmit={(event) => { event.preventDefault(); if (!email.trim()) return; setJoined(true); showToast('You’re on the Sonora list'); }}><label htmlFor="newsletter-email">YOUR EMAIL ADDRESS</label><div className="newsletter-input"><input id="newsletter-email" type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required /><button aria-label="Subscribe" type="submit">{joined ? <Check size={19} /> : <ArrowRight size={19} />}</button></div><span>{joined ? 'You’re on the list. Talk soon.' : 'No noise. Unsubscribe whenever.'}</span></form></section>
  </>;
}

function Shop({ addToCart, toggleSaved, saved }) {
  const [activeCategory, setActiveCategory] = useState('All gear');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('Featured');
  const filtered = useMemo(() => {
    const list = products.filter((product) => (activeCategory === 'All gear' || product.category === activeCategory) && `${product.name} ${product.category} ${product.color}`.toLowerCase().includes(search.toLowerCase()));
    if (sort === 'Price: low to high') return list.sort((a, b) => a.price - b.price);
    if (sort === 'Top rated') return list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [activeCategory, search, sort]);
  return <section className="shop-page"><div className="shop-intro"><p className="eyebrow"><span className="eyebrow-dot" /> THE SONORA LINEUP</p><h1>Find your <span>frequency.</span></h1><p>Everyday audio for the life you actually live.</p></div><div className="shop-toolbar"><div className="category-tabs" role="tablist" aria-label="Filter by category">{categories.map((category) => <button key={category} role="tab" aria-selected={activeCategory === category} className={activeCategory === category ? 'category-tab active' : 'category-tab'} onClick={() => setActiveCategory(category)}>{category}</button>)}</div><div className="shop-controls"><label className="search-control"><Search size={17} /><input aria-label="Search products" placeholder="Find your sound" value={search} onChange={(event) => setSearch(event.target.value)} /><button aria-label="Clear search" onClick={() => setSearch('')}><X size={14} /></button></label><label className="sort-control"><select aria-label="Sort products" value={sort} onChange={(event) => setSort(event.target.value)}><option>Featured</option><option>Price: low to high</option><option>Top rated</option></select><ChevronDown size={15} /></label></div></div><div className="shop-result-line"><span>{filtered.length} pieces of good sound</span><span>DESIGNED TO GO PLACES</span></div><ProductGrid items={filtered} addToCart={addToCart} toggleSaved={toggleSaved} saved={saved} /></section>;
}

function ProductDetail({ addToCart, toggleSaved, saved }) {
  const { id } = useParams();
  const product = products.find((item) => item.id === id);
  const [quantity, setQuantity] = useState(1);
  if (!product) return <NotFound />;
  return <section className="detail-page"><Link to="/shop" className="back-link"><ArrowLeft size={15} /> Back to all gear</Link><div className="detail-layout"><div className={`detail-image tone-${product.tone}`}><img src={product.image} alt={product.name} /><span className="product-tag">{product.tag}</span></div><div className="detail-copy"><p className="eyebrow">{product.category.toUpperCase()} · {product.color.toUpperCase()}</p><h1>{product.name}<span>.</span></h1><div className="detail-rating"><span className="proof-stars">★★★★★</span> {product.rating} <span>({product.reviews} reviews)</span></div><div className="detail-prices"><strong>{formatPrice(product.price)}</strong><del>{formatPrice(product.oldPrice)}</del><span>{Math.round((1 - product.price / product.oldPrice) * 100)}% off</span></div><p className="detail-description">{product.description}</p><ul className="feature-list">{product.features.map((feature) => <li key={feature}><Check size={16} />{feature}</li>)}</ul><div className="detail-buy-row"><div className="quantity-control"><button onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Decrease quantity"><Minus size={15} /></button><span>{quantity}</span><button onClick={() => setQuantity((value) => value + 1)} aria-label="Increase quantity"><Plus size={15} /></button></div><button className="button button-dark add-detail" onClick={() => addToCart(product, quantity)}>Add to bag <span>{formatPrice(product.price * quantity)}</span></button><button className={`detail-save ${saved.includes(product.id) ? 'is-saved' : ''}`} onClick={() => toggleSaved(product)} aria-label="Save product"><Heart size={19} fill={saved.includes(product.id) ? 'currentColor' : 'none'} /></button></div><p className="shipping-note"><Truck size={16} /> Free delivery & easy 7-day returns</p><div className="detail-accordion"><details><summary>WHAT’S IN THE BOX <ChevronDown size={16} /></summary><p>Your Sonora {product.name}, a charging cable, quick-start guide and a whole lot of good sound.</p></details><details><summary>DELIVERY & RETURNS <ChevronDown size={16} /></summary><p>Free delivery over ₹1,999. Try it out at home with easy 7-day returns.</p></details></div></div></div></section>;
}

function Cart({ cart, changeQuantity, showToast }) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return <section className="cart-page"><div className="cart-title"><p className="eyebrow">THE GOOD STUFF YOU PICKED</p><h1>Your bag<span>.</span></h1><span>{cart.reduce((sum, item) => sum + item.quantity, 0)} items</span></div>{cart.length === 0 ? <div className="cart-empty"><div className="empty-icon"><ShoppingBag size={27} /></div><h2>A little quiet in here.</h2><p>Your next favourite sound is waiting.</p><Link to="/shop" className="button button-dark">Explore the lineup <ArrowRight size={16} /></Link></div> : <div className="cart-layout"><div className="cart-items">{cart.map((item) => <article className="cart-item" key={item.id}><Link to={`/product/${item.id}`} className={`cart-item-image tone-${item.tone}`}><img src={item.image} alt={item.name} /></Link><div className="cart-item-info"><Link to={`/product/${item.id}`} className="cart-item-name">{item.name}</Link><span>{item.color}</span><div className="cart-quantity"><button onClick={() => changeQuantity(item.id, -1)} aria-label="Remove one"><Minus size={13} /></button><span>{item.quantity}</span><button onClick={() => changeQuantity(item.id, 1)} aria-label="Add one"><Plus size={13} /></button></div></div><strong>{formatPrice(item.price * item.quantity)}</strong></article>)}</div><aside className="order-summary"><h2>Your total</h2><div><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div><div><span>Delivery</span><span className="free-shipping">On us</span></div><p>Taxes included. Good things, coming right up.</p><button className="button button-dark checkout-button" onClick={() => showToast('Checkout is a demo and is not connected to payments')}>Continue to checkout <ArrowRight size={16} /></button><Link to="/shop" className="continue-link"><ArrowLeft size={14} /> Keep looking</Link></aside></div>}</section>;
}

function Account({ user, setUser, showToast }) {
  const [mode, setMode] = useState('signin');
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const validate = () => {
    const next = {};
    if (mode === 'signup' && values.name.trim().length < 2) next.name = 'Please enter your name (at least 2 characters).';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = 'Enter a valid email address.';
    if (values.password.length < 8) next.password = 'Use at least 8 characters for your password.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };
  const submit = (event) => {
    event.preventDefault();
    if (!validate()) return;
    const nextUser = { name: mode === 'signup' ? values.name.trim() : values.email.split('@')[0], email: values.email };
    setUser(nextUser);
    showToast(mode === 'signup' ? 'Your Sonora account is ready' : 'Welcome back');
  };
  if (user) return <section className="account-page"><div className="account-card account-welcome"><div className="account-icon"><Sparkles size={22} /></div><p className="eyebrow">GOOD TO HAVE YOU HERE</p><h1>Hey, {user.name}<span>.</span></h1><p>You’re signed in as {user.email}.</p><button className="button button-dark" onClick={() => { setUser(null); showToast('You’re signed out'); }}>Sign out <ArrowRight size={16} /></button><Link to="/shop" className="text-link">Back to the good stuff <ArrowRight size={15} /></Link></div></section>;
  return <section className="account-page"><div className="account-aside"><p className="eyebrow">YOUR SOUND, YOUR SPACE</p><h2>Good things<br />sound better<br /><span>together.</span></h2><span className="account-aside-mark">s.</span><p>Keep your favourites close, track your orders and get first listen on new drops.</p></div><div className="account-card"><div className="account-tabs"><button className={mode === 'signin' ? 'active' : ''} onClick={() => { setMode('signin'); setErrors({}); }}>Sign in</button><button className={mode === 'signup' ? 'active' : ''} onClick={() => { setMode('signup'); setErrors({}); }}>Create account</button></div><p className="eyebrow">{mode === 'signin' ? 'GOOD TO HAVE YOU BACK' : 'COME ON IN'}</p><h1>{mode === 'signin' ? 'Welcome back.' : 'Join the good side.'}</h1><p className="account-intro">{mode === 'signin' ? 'Pick up right where your playlist left off.' : 'A better soundtrack starts right here.'}</p><form className="auth-form" onSubmit={submit} noValidate>
    {mode === 'signup' && <div className="field"><label htmlFor="auth-name">YOUR NAME</label><input id="auth-name" autoComplete="name" value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} placeholder="The name your friends use" />{errors.name && <small id="name-error" className="field-error">{errors.name}</small>}</div>}
    <div className="field"><label htmlFor="auth-email">EMAIL ADDRESS</label><input id="auth-email" type="email" autoComplete="email" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} placeholder="you@example.com" />{errors.email && <small id="email-error" className="field-error">{errors.email}</small>}</div>
    <div className="field"><label htmlFor="auth-password">PASSWORD</label><input id="auth-password" type="password" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} value={values.password} onChange={(event) => setValues({ ...values, password: event.target.value })} aria-invalid={!!errors.password} aria-describedby={errors.password ? 'password-error' : undefined} placeholder="At least 8 characters" />{errors.password && <small id="password-error" className="field-error">{errors.password}</small>}</div>
    <button type="submit" className="button button-dark auth-submit">{mode === 'signin' ? 'Sign in' : 'Create my account'} <ArrowRight size={16} /></button></form><p className="auth-footnote">By continuing, you agree to our <a href="#terms">Terms</a> &amp; <a href="#privacy">Privacy Policy</a>.</p></div></section>;
}

function NotFound() { return <section className="not-found"><span>404</span><h1>This sound doesn’t exist.</h1><Link to="/shop" className="button button-dark">Back to the good stuff <ArrowRight size={16} /></Link></section>; }

function Footer() {
  const [email, setEmail] = useState('');
  return <footer className="site-footer"><div className="footer-main"><div className="footer-brand"><Link to="/" className="wordmark">sonora<span>®</span></Link><p>For the soundtrack<br />of your everyday.</p><a className="social-link" href="https://instagram.com" aria-label="Instagram"><Camera size={17} /></a></div><div className="footer-links"><div><span className="footer-label">THE LINEUP</span><Link to="/shop">Shop all</Link><Link to="/shop">Headphones</Link><Link to="/shop">Earbuds</Link><Link to="/shop">Wearables</Link></div><div><span className="footer-label">THE DETAILS</span><a href="#shipping">Shipping & returns</a><a href="#warranty">Warranty</a><a href="#support">Get in touch</a><Link to="/account">Your account</Link></div></div><div className="footer-news"><span className="footer-label">A NOTE FROM US</span><p>Occasional good stuff.<br />Zero extra noise.</p><form className="footer-signup" onSubmit={(event) => { event.preventDefault(); if (email) { setEmail(''); showToast('You’re on the Sonora list'); } }}><input aria-label="Email for newsletter" type="email" required placeholder="Your email address" value={email} onChange={(event) => setEmail(event.target.value)} /><button aria-label="Join newsletter"><ArrowRight size={17} /></button></form></div></div><div className="footer-bottom"><span>© 2025 Sonora Audio Co.</span><span>MADE FOR YOUR EVERYDAY EXTRA.</span><div><a href="#privacy">Privacy</a><a href="#terms">Terms</a></div></div></footer>;
}

export default App;
