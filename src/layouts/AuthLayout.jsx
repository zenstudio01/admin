import {
  Building2,
  CheckCircle2,
} from "lucide-react";

import {
  Outlet,
} from "react-router-dom";

import Colors from "../constants/colors";

const features = [
  "Manage properties and units",
  "Track tenants and leases",
  "Monitor rent and payments",
  "Handle maintenance requests",
];

export default function AuthLayout() {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor:
          Colors.background,
      }}
    >
      <div className="grid min-h-screen lg:grid-cols-2">
        <section
          className="relative hidden overflow-hidden p-12 text-white lg:flex lg:flex-col lg:justify-between"
          style={{
            backgroundColor:
              Colors.primary,
          }}
        >
          <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-white/10" />

          <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-white/10" />

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                <Building2 size={26} />
              </div>

              <div>
                <h1 className="text-2xl font-bold">
                  UNIT
                </h1>

                <p className="text-sm text-white/75">
                  Property Management
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 max-w-lg">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-white/70">
              Property management made simple
            </p>

            <h2 className="text-4xl font-bold leading-tight xl:text-5xl">
              Manage your entire property
              portfolio from one platform.
            </h2>

            <p className="mt-6 text-base leading-7 text-white/80">
              UNIT connects property managers,
              landlords, company staff, and
              tenants through one secure
              workspace.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {features.map(
                (feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2
                      size={20}
                      className="shrink-0"
                    />

                    <span className="text-sm text-white/90">
                      {feature}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          <p className="relative z-10 text-sm text-white/65">
            © {new Date().getFullYear()} UNIT.
            All rights reserved.
          </p>
        </section>

        <main className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl text-white"
                style={{
                  backgroundColor:
                    Colors.primary,
                }}
              >
                <Building2 size={24} />
              </div>

              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  UNIT
                </h1>

                <p className="text-xs text-gray-500">
                  Property Management
                </p>
              </div>
            </div>

            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}