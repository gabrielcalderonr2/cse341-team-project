/**
 * Middleware to protect API routes that require authentication.
 * Returns HTTP 401 when the user is not logged in.
 */
export const requireApiLogin = (req, res, next) => {
    if (!req.session?.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required.'
        });
    }

    return next();
};

/**
 * Middleware to protect pages that require authentication.
 * Redirects unauthenticated users to the login page.
 */
export const requirePageLogin = (req, res, next) => {
    if (!req.session?.user) {
        return res.redirect('/auth/login');
    }

    return next();
};

/**
 * Middleware to protect API routes based on user role.
 * Returns HTTP 401 if unauthenticated or 403 if unauthorized.
 */
export const requireApiRole = (role) => (req, res, next) => {
    if (!req.session?.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required.'
        });
    }

    if (req.session.user.role !== role) {
        return res.status(403).json({
            success: false,
            message: 'You do not have permission to access this resource.'
        });
    }

    return next();
};

/**
 * Middleware to protect pages based on user role.
 * Redirects unauthenticated users and renders a 403 page
 * when they do not have the required role.
 */
export const requirePageRole = (role) => (req, res, next) => {
    if (!req.session?.user) {
        return res.redirect('/auth/login');
    }

    if (req.session.user.role !== role) {
        return res.status(403).render('errors/403', {
            title: 'Access Denied'
        });
    }

    return next();
};
