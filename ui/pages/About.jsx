import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import {
  FaTwitter as TwitterIcon,
  FaInstagram as InstagramIcon,
  FaLinkedin as LinkedInIcon,
  FaEnvelope as MailIcon,
} from 'react-icons/fa';

const Container = lazy(() => import('../components/Container'));

function SocialLink({ className, href, children, icon: Icon }) {
  return (
    <li className={clsx(className, 'flex')}>
      <Link
        to={href}
        className="group flex text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
      >
        <Icon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-teal-500" />
        <span className="ml-4">{children}</span>
      </Link>
    </li>
  );
}

const About = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Container className="mt-16 sm:mt-32 min-h-screen">
        <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-6">
          {/* Content about That Connect */}
          <div className="lg:order-first lg:row-span-2">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
              That Connect: Uniting Hearts
            </h1>
            <div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
              <p>
                Discover a world where love knows no bounds. That Connect is an exclusive dating community that brings together singles from all walks of life. Our platform is designed to help you find companionship, friendship, and true love.
              </p>
              <h2>
                Why Join That Connect?
              </h2>
              <ul>
                <li>Innovative Matching Algorithm: Our system is designed to connect you with compatible partners based on shared interests, values, and lifestyle preferences.</li>
                <li>Safe and Secure: We prioritize your safety, ensuring all conversations and personal information are kept confidential.</li>
                <li>Engaging Community: Join discussions, attend virtual events, and engage with other members who share your passion for meaningful connections.</li>
                <li>Personalized Experience: Tailor your profile to showcase your unique personality, and let others know exactly what you're looking for in a partner.</li>
              </ul>
              <p>
                Our mission is to help you find someone who complements you perfectly, someone who will be by your side through thick and thin. Sign up today and start your journey to finding true love.
              </p>
              <h3>
                Your Love Story Starts Here
              </h3>
              <p>
                At That Connect, every match has a story. Create yours now by joining the most passionate dating community on the web.
              </p>
            </div>
          </div>
          {/* Social links */}
          <div className="lg:pl-20">
            <ul role="list">
              <SocialLink href="#" icon={TwitterIcon}>
                Follow on Twitter
              </SocialLink>
              <SocialLink href="#" icon={InstagramIcon} className="mt-4">
                Follow on Instagram
              </SocialLink>
              <SocialLink href="#" icon={LinkedInIcon} className="mt-4">
                Connect on LinkedIn
              </SocialLink>
              <SocialLink href="mailto:support@thatconnect.com" icon={MailIcon} className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-700/40">
                Email Us
              </SocialLink>
            </ul>
          </div>
        </div>
      </Container>
    </Suspense>
  );
};

export default About;
