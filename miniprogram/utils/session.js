function normalizeSession(user, token) {
  if (user && token) {
    return { user, token };
  }
  return { user: null, token: '' };
}

function hasSession(session) {
  return Boolean(session.user && session.token);
}

module.exports = { hasSession, normalizeSession };

