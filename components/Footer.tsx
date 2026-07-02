'use client';

import { Tv2, Facebook, Twitter, Youtube, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-slate-950/80">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-red-700">
                <Tv2 className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold">
                <span className="text-white">Stream</span>
                <span className="text-red-500">Zone</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Your #1 destination for free live sports streaming. Watch football, basketball, cricket and more.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">Quick Links</h4>
            <ul className="space-y-2">
              {['Live Matches', 'Schedule', 'Football', 'Basketball', 'Cricket', 'Tennis'].map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-slate-500 hover:text-red-400 transition-colors duration-200">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">Support</h4>
            <ul className="space-y-2">
              {['FAQ', 'Contact Us', 'Report Issue', 'Terms of Service', 'Privacy Policy', 'DMCA'].map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-slate-500 hover:text-red-400 transition-colors duration-200">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">Follow Us</h4>
            <p className="mb-4 text-sm text-slate-500">Follow our Facebook page to unlock free streams!</p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, color: 'hover:text-blue-400', label: 'Facebook' },
                { icon: Twitter, color: 'hover:text-sky-400', label: 'Twitter' },
                { icon: Youtube, color: 'hover:text-red-400', label: 'YouTube' },
                { icon: Mail, color: 'hover:text-green-400', label: 'Email' },
              ].map(({ icon: Icon, color, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 ${color} hover:bg-white/10 transition-all duration-200`}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} StreamZone. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            This site does not host any video files. Links are provided for entertainment purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
