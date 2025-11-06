import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';

function initSentry() {
  const environment = process.env.NODE_ENV || 'development';
  const dsn = process.env.SENTRY_DSN_BACKEND;

  if (!dsn) {
    console.warn('⚠️  SENTRY_DSN_BACKEND not configured. Sentry monitoring disabled.');
    return;
  }

  Sentry.init({
    dsn: dsn,
    environment: environment,
    release: process.env.SENTRY_RELEASE || '1.0.0',
    
    // Performance monitoring
    tracesSampleRate: environment === 'production' ? 0.1 : 1.0,
    
    // Profiling
    profilesSampleRate: 1.0,
    
    // Integrations
    integrations: [
      // HTTP integration for tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // Express integration
      new Sentry.Integrations.Express({ app: true }),
      // Profiling
      new ProfilingIntegration(),
    ],

    // Don't capture console logs in production
    beforeSend(event) {
      if (environment === 'development') {
        console.log('🐛 Sentry event captured:', event.exception?.values?.[0]?.type);
      }
      return event;
    },
  });

  console.log(`✅ Sentry initialized (${environment})`);
}

export { initSentry, Sentry };
