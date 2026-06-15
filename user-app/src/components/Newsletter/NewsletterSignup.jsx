import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Check, AlertCircle, Loader } from 'lucide-react';
import Toast from '../Common/Toast';
import { db } from '../../services/firebaseConfig';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [toast, setToast] = useState(null);

  // Email validation
  const validateEmail = (emailValue) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(emailValue);
  };

  // Check if email already subscribed
  const isEmailAlreadySubscribed = async (emailValue) => {
    try {
      const subscribersRef = collection(db, 'newsletter_subscribers');
      const q = query(subscribersRef, where('email', '==', emailValue.toLowerCase()));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };

  // Handle newsletter subscription
  const handleSubscribe = async (e) => {
    e.preventDefault();

    // Validation
    if (!email.trim()) {
      setState('error');
      setErrorMessage('Please enter your email address');
      setToast({
        type: 'error',
        message: 'Please enter your email address',
      });
      setTimeout(() => setState('idle'), 3000);
      return;
    }

    if (!validateEmail(email)) {
      setState('error');
      setErrorMessage('Please enter a valid email');
      setToast({
        type: 'error',
        message: 'Please enter a valid email address',
      });
      setTimeout(() => setState('idle'), 3000);
      return;
    }

    setState('loading');
    setErrorMessage('');

    try {
      // Check for duplicates
      const alreadySubscribed = await isEmailAlreadySubscribed(email);
      if (alreadySubscribed) {
        setState('error');
        setErrorMessage('This email is already subscribed');
        setToast({
          type: 'error',
          message: 'This email is already subscribed',
        });
        setTimeout(() => setState('idle'), 3000);
        return;
      }

      // Add to Firestore
      const subscribersRef = collection(db, 'newsletter_subscribers');
      await addDoc(subscribersRef, {
        email: email.toLowerCase(),
        subscribedAt: new Date().toISOString(),
        status: 'active',
      });

      // Success
      setState('success');
      setToast({
        type: 'success',
        message: 'You\'ve been subscribed! Check your email for exclusive offers.',
      });
      setEmail('');

      // Reset after 4 seconds
      setTimeout(() => {
        setState('idle');
      }, 4000);
    } catch (error) {
      console.error('Subscription error:', error);
      setState('error');
      setErrorMessage('Failed to subscribe. Please try again.');
      setToast({
        type: 'error',
        message: 'Failed to subscribe. Please try again.',
      });
      setTimeout(() => setState('idle'), 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="w-full py-16 bg-gradient-to-r from-pulse-gold/10 via-pulse-accent/10 to-pulse-gold/10 border-y border-pulse-gold/30"
    >
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h3 className="text-4xl md:text-5xl font-black text-pulse-text mb-3 uppercase">
            Get Exclusive Deals
          </h3>
          <p className="text-pulse-text-secondary text-lg">
            Subscribe for early access to new products and special offers.
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          onSubmit={handleSubscribe}
          className="flex flex-col sm:flex-row gap-3 mb-4"
        >
          {/* Input Field */}
          <motion.div
            className="flex-1 relative"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pulse-text-secondary pointer-events-none" />
            <input
              type="email"
              placeholder="Enter your email..."
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (state === 'error') setState('idle');
              }}
              disabled={state === 'loading' || state === 'success'}
              className={`w-full pl-12 pr-4 py-4 bg-pulse-bg border-2 rounded-lg text-pulse-text placeholder-pulse-text-secondary focus:outline-none transition ${
                state === 'error'
                  ? 'border-red-500/50 focus:border-red-500'
                  : state === 'success'
                    ? 'border-green-500/50 focus:border-green-500'
                    : 'border-pulse-gold/30 focus:border-pulse-gold'
              }`}
            />
          </motion.div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: state === 'loading' ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={state === 'loading' || state === 'success'}
            className={`px-8 md:px-12 py-4 font-bold rounded-lg transition-all duration-300 whitespace-nowrap flex items-center justify-center gap-2 ${
              state === 'success'
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : state === 'error'
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-pulse-gold hover:bg-pulse-gold-dark text-pulse-bg'
            } ${state === 'loading' ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {state === 'loading' && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Loader className="w-5 h-5" />
              </motion.div>
            )}
            {state === 'success' && <Check className="w-5 h-5" />}
            {state === 'error' && <AlertCircle className="w-5 h-5" />}
            <span>
              {state === 'loading' ? 'Subscribing...' : state === 'success' ? 'Subscribed!' : 'Subscribe'}
            </span>
          </motion.button>
        </motion.form>

        {/* Error Message */}
        {state === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-sm text-center"
          >
            {errorMessage}
          </motion.div>
        )}

        {/* Success Message */}
        {state === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 text-green-400 text-center"
          >
            ✓ Thanks for subscribing! You'll receive exclusive offers soon.
          </motion.div>
        )}

        {/* Privacy Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-pulse-text-secondary text-xs mt-6"
        >
          We respect your privacy. Unsubscribe anytime.
        </motion.p>
      </div>

      {/* Toast Notification */}
      {toast && <Toast type={toast.type} message={toast.message} />}
    </motion.div>
  );
};

export default NewsletterSignup;
