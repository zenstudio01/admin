import React, { useEffect, useState } from "react";
import Layout from "../../layouts/Layout";
import api from "../../api/api";
import {
  User,
  Mail,
  Phone,
  Building2,
  CreditCard,
  Calendar,
  Shield,
  Lock,
  Home,
  Building,
  Users,
  CheckCircle,
  Edit,
} from "lucide-react";

export default function PMProfile() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/property_manager_profile/");
      setProfile(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[70vh]">
          <div className="h-10 w-10 border-4 border-[#2E9D47] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#F4F1E6]/40 p-6">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A4429]">
            My Profile
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your account and subscription.
          </p>
        </div>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row items-center justify-between mb-8">

          <div className="flex items-center gap-6">

            <img
              src={
                profile.user.profile_image ||
                "https://ui-avatars.com/api/?name=" + profile.user.name
              }
              alt=""
              className="w-28 h-28 rounded-full object-cover border-4 border-[#2E9D47]"
            />

            <div>

              <h2 className="text-2xl font-bold text-[#0A4429]">
                {profile.user.name}
              </h2>

              <p className="text-[#2E9D47] font-medium">
                {profile.user.role}
              </p>

              <div className="mt-3 space-y-1 text-gray-600">

                <p className="flex items-center gap-2">
                  <Mail size={16} />
                  {profile.user.email}
                </p>

                <p className="flex items-center gap-2">
                  <Phone size={16} />
                  {profile.user.phone_number}
                </p>

              </div>

            </div>

          </div>

          <button className="mt-6 md:mt-0 flex items-center gap-2 bg-[#2E9D47] hover:bg-[#0A4429] text-white px-6 py-3 rounded-xl">
            <Edit size={18} />
            Edit Profile
          </button>

        </div>

        {/* Statistics */}

        <div className="grid md:grid-cols-4 gap-6 mb-8">

          {[
            {
              icon: Home,
              label: "Properties",
              value: profile.statistics.properties,
            },
            {
              icon: Building,
              label: "Units",
              value: profile.statistics.units,
            },
            {
              icon: Users,
              label: "Tenants",
              value: profile.statistics.tenants,
            },
            {
              icon: Building2,
              label: "Landlords",
              value: profile.statistics.landlords,
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <item.icon className="text-[#2E9D47]" size={32} />

              <h2 className="text-3xl font-bold mt-4 text-[#0A4429]">
                {item.value}
              </h2>

              <p className="text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Two Columns */}

        <div className="grid lg:grid-cols-2 gap-8 mb-8">

          {/* Personal */}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

            <h2 className="text-xl font-bold text-[#0A4429] mb-6">
              Personal Information
            </h2>

            <div className="space-y-5">

              <Info icon={User} label="Full Name" value={profile.user.name} />

              <Info icon={Mail} label="Email" value={profile.user.email} />

              <Info
                icon={Phone}
                label="Phone"
                value={profile.user.phone_number}
              />

              <Info
                icon={Building2}
                label="Company"
                value={profile.user.company}
              />

              <Info
                icon={CreditCard}
                label="National ID"
                value={profile.user.national_id}
              />

              <Info
                icon={Calendar}
                label="Joined"
                value={profile.user.date_joined}
              />
            </div>
          </div>

          {/* Subscription */}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

            <h2 className="text-xl font-bold text-[#0A4429] mb-6">
              Subscription
            </h2>

            <div className="space-y-5">

              <Info
                icon={CreditCard}
                label="Current Package"
                value={profile.subscription.package}
              />

              <Info
                icon={Shield}
                label="Status"
                value={profile.subscription.status}
              />

              <Info
                icon={Calendar}
                label="Expires"
                value={profile.subscription.expires_at}
              />

              <Info
                icon={Calendar}
                label="Remaining"
                value={`${profile.subscription.remaining_days} Days`}
              />

            </div>

            <div className="mt-8">

              <div className="flex justify-between text-sm mb-2">
                <span>Properties Used</span>
                <span>
                  {profile.subscription.usage.properties}/
                  {profile.subscription.limits.properties}
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-[#2E9D47] h-3 rounded-full"
                  style={{
                    width: `${
                      (profile.subscription.usage.properties /
                        profile.subscription.limits.properties) *
                      100
                    }%`,
                  }}
                />
              </div>

            </div>

          </div>

        </div>

        {/* Features */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">

          <h2 className="text-xl font-bold text-[#0A4429] mb-6">
            Features Included
          </h2>

          <div className="grid md:grid-cols-3 gap-4">

            {profile.subscription.features.map((feature, index) => (

              <div
                key={index}
                className="flex items-center gap-3 border rounded-xl p-4"
              >

                <CheckCircle className="text-[#2E9D47]" />

                <span>{feature}</span>

              </div>

            ))}

          </div>

        </div>

        {/* Security */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

          <h2 className="text-xl font-bold text-[#0A4429] mb-6">
            Security
          </h2>

          <div className="flex flex-wrap gap-4">

            <button className="flex items-center gap-2 px-6 py-3 bg-[#2E9D47] text-white rounded-xl hover:bg-[#0A4429]">
              <Lock size={18} />
              Change Password
            </button>

            <button className="flex items-center gap-2 px-6 py-3 border rounded-xl hover:bg-gray-100">
              <Shield size={18} />
              Two Factor Authentication
            </button>

          </div>

        </div>

      </div>
    </Layout>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between border-b pb-3">

      <div className="flex items-center gap-3 text-gray-600">
        <Icon size={18} className="text-[#2E9D47]" />
        <span>{label}</span>
      </div>

      <span className="font-semibold text-[#0A4429]">
        {value}
      </span>

    </div>
  );
}