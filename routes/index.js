const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const productsRoutes = require('./products');
const categoriesRoutes = require('./categories');
const ordersRoutes = require('./orders');
const reviewsRoutes = require('./reviews');

// Root endpoint - Serves rich interactive UI for browser visitors, and JSON for API clients
router.get('/', (req, res) => {
  // #swagger.tags = ['Home']
  // #swagger.description = 'API root endpoint displaying interactive login/status dashboard and collection links'
  const user = (req.session && req.session.user) || req.user || null;

  // If request explicitly prefers JSON (REST client, curl, etc.)
  if (
    req.headers.accept &&
    req.headers.accept.includes('application/json') &&
    !req.headers.accept.includes('text/html')
  ) {
    return res.status(200).json({
      message: 'Welcome to the Marketeer E-Commerce REST API',
      documentation: '/api-docs',
      authentication: {
        loggedIn: !!user,
        user: user
          ? {
              id: user.id || user._json?.id,
              username: user.username || user._json?.login,
            }
          : null,
        login: '/login',
        logout: '/logout',
        status: '/auth/status',
      },
      collections: {
        products: '/products',
        categories: '/categories',
        orders: '/orders',
        reviews: '/reviews',
      },
    });
  }

  // Interactive HTML Dashboard for browser visits
  if (user) {
    const displayName =
      user.displayName ||
      user.username ||
      user._json?.name ||
      user._json?.login ||
      'Market Manager';
    const avatarUrl = user._json?.avatar_url || '';

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Marketeer API - Dashboard</title>
        <style>
          * { box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            max-width: 860px;
            margin: 40px auto;
            padding: 0 20px;
            color: #1e293b;
            background: #f8fafc;
            line-height: 1.6;
          }
          .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
          h1 { margin: 0; color: #0f172a; font-size: 1.8rem; }
          .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 9999px;
            background: #dcfce7;
            color: #15803d;
            font-weight: 600;
            font-size: 0.85rem;
          }
          .card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 20px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          }
          .user-profile {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 16px;
          }
          .user-avatar {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            border: 2px solid #3b82f6;
          }
          .btn-group { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; }
          .btn {
            display: inline-block;
            padding: 10px 18px;
            background: #2563eb;
            color: #ffffff;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 500;
            font-size: 0.95rem;
            transition: background 0.15s ease;
          }
          .btn:hover { background: #1d4ed8; }
          .btn-secondary { background: #475569; }
          .btn-secondary:hover { background: #334155; }
          .btn-logout { background: #ef4444; }
          .btn-logout:hover { background: #dc2626; }
          .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-top: 14px; }
          .collection-card {
            background: #f1f5f9;
            padding: 12px 16px;
            border-radius: 8px;
            text-decoration: none;
            color: #0f172a;
            font-weight: 500;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .collection-card:hover { background: #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="user-profile">
            ${avatarUrl ? `<img class="user-avatar" src="${avatarUrl}" alt="Avatar">` : ''}
            <div>
              <h2 style="margin: 0; font-size: 1.25rem;">Welcome back, ${displayName}!</h2>
              <p style="margin: 4px 0 0; color: #64748b; font-size: 0.9rem;">
                GitHub OAuth session established. You have full authorization for write operations (POST, PUT, DELETE).
              </p>
            </div>
          </div>

          <div class="btn-group">
            <a class="btn" href="/api-docs">Explore Swagger API Docs</a>
            <a class="btn btn-secondary" href="/auth/profile">View Profile</a>
            <a class="btn btn-secondary" href="/auth/status">Session Status</a>
            <a class="btn btn-logout" href="/logout">Logout</a>
          </div>
        </div>
      </body>
      </html>
    `);
  } else {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Marketeer API - Welcome</title>
        <style>
          * { box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            max-width: 860px;
            margin: 40px auto;
            padding: 0 20px;
            color: #1e293b;
            background: #f8fafc;
            line-height: 1.6;
          }
          .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
          h1 { margin: 0; color: #0f172a; font-size: 1.8rem; }
          .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 9999px;
            background: #fee2e2;
            color: #b91c1c;
            font-weight: 600;
            font-size: 0.85rem;
          }
          .card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 20px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          }
          .btn-group { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; }
          .btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 18px;
            background: #0f172a;
            color: #ffffff;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 500;
            font-size: 0.95rem;
            transition: background 0.15s ease;
          }
          .btn:hover { background: #1e293b; }
          .btn-docs { background: #2563eb; }
          .btn-docs:hover { background: #1d4ed8; }
          .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-top: 14px; }
          .collection-card {
            background: #f1f5f9;
            padding: 12px 16px;
            border-radius: 8px;
            text-decoration: none;
            color: #0f172a;
            font-weight: 500;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .collection-card:hover { background: #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Marketeer REST API</h1>
        </div>

        <div class="card">
          <h2 style="margin-top: 0; font-size: 1.25rem;">E-Commerce & Retail Marketing API</h2>
          <p style="color: #475569;">
            You are currently browsing as a guest. All public read endpoints (<code>GET</code>) are open and accessible.
            To create, update, or delete catalog items, orders, or reviews, please log in with your GitHub account.
          </p>

          <div class="btn-group">
            <a class="btn" href="/login">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              Login with GitHub
            </a>
            <a class="btn btn-docs" target="_blank" href="/api-docs">Open Swagger API Docs</a>
          </div>
        </div>
      </body>
      </html>
    `);
  }
});

// Authentication routes
router.use('/auth', authRoutes);
router.use('/', authRoutes); // Exposes /login, /logout, /github/callback at root

// Resource collections
router.use('/products', productsRoutes);
router.use('/categories', categoriesRoutes);
router.use('/orders', ordersRoutes);
router.use('/reviews', reviewsRoutes);

module.exports = router;
