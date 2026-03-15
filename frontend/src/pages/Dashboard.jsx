import "./Dashboard.css";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../lib/api";

const DASHBOARD_TABS = new Set(["addresses", "orders", "profile"]);

function Dashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, token, updateUser, logout } = useAuth();

  const initialTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(
    DASHBOARD_TABS.has(initialTab) ? initialTab : "addresses"
  );
  const [showForm, setShowForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressPendingDelete, setAddressPendingDelete] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    block: "",
    floor: "",
    room: ""
  });

  const sectionMeta = {
    addresses: {
      title: "Saved Addresses",
      description: "Manage the hostel address used during checkout."
    },
    orders: {
      title: "Order History",
      description: "See your previous orders in one place."
    },
    profile: {
      title: "Profile Settings",
      description: "Update your name or password."
    }
  };

  // Query params keep direct links like /dashboard?tab=orders working after refresh.
  useEffect(() => {
    const nextTab = searchParams.get("tab");

    if (DASHBOARD_TABS.has(nextTab) && nextTab !== activeTab) {
      setActiveTab(nextTab);
      return;
    }

    if (!nextTab && activeTab !== "addresses") {
      setActiveTab("addresses");
    }
  }, [activeTab, searchParams]);

  const switchTab = (tab) => {
    setActiveTab(tab);

    if (tab === "addresses") {
      setSearchParams({});
      return;
    }

    setSearchParams({ tab });
  };

  // One dashboard request hydrates the user profile, addresses, and order history together.
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    setLoading(true);
    setAddresses([]);
    setOrders([]);
    setShowForm(false);
    setEditingAddressId(null);
    setAddressPendingDelete(null);

    const loadDashboard = async () => {
      try {
        const data = await apiRequest("/api/user/me", { token });
        updateUser(data.user);
        setAddresses(data.addresses || []);
        setOrders(data.orders || []);
      } catch (error) {
        toast.error(error.message);
        logout();
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [token, navigate, updateUser, logout]);

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      block: "",
      floor: "",
      room: ""
    });
    setEditingAddressId(null);
    setShowForm(false);
  };

  // Phone cleanup here prevents accidental spaces or symbols from leaking into saved address data.
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "phone" ? value.replace(/[^0-9]/g, "") : value
    }));
  };

  // The same form handles both create and edit so the address flow stays predictable.
  const handleSaveAddress = async (event) => {
    event.preventDefault();

    try {
      const payload = {
        ...formData,
        floor: Number(formData.floor),
        room: Number(formData.room),
        isDefault: editingAddressId
          ? addresses.find((address) => address._id === editingAddressId)?.isDefault
          : addresses.length === 0
      };

      const data = await apiRequest(
        editingAddressId
          ? `/api/user/addresses/${editingAddressId}`
          : "/api/user/addresses",
        {
          method: editingAddressId ? "PUT" : "POST",
          token,
          body: JSON.stringify(payload)
        }
      );

      setAddresses(data.addresses || []);
      toast.success(data.message);
      resetForm();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Editing simply preloads the existing address into the shared form.
  const handleEdit = (address) => {
    setEditingAddressId(address._id);
    setFormData({
      name: address.name,
      phone: address.phone,
      block: address.block,
      floor: String(address.floor),
      room: String(address.room)
    });
    setShowForm(true);
  };

  // Delete is confirmed in a custom modal so users do not lose an address with an accidental click.
  const handleDelete = async (addressId) => {
    try {
      const data = await apiRequest(`/api/user/addresses/${addressId}`, {
        method: "DELETE",
        token
      });

      setAddresses(data.addresses || []);
      if (editingAddressId === addressId) {
        resetForm();
      }
      setAddressPendingDelete(null);
      toast.error("Address deleted");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const setDefaultAddress = async (addressId) => {
    try {
      const data = await apiRequest(`/api/user/addresses/${addressId}/default`, {
        method: "PATCH",
        token
      });

      setAddresses(data.addresses || []);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeDefaultAddress = async () => {
    if (!editingAddressId) {
      return;
    }

    try {
      const data = await apiRequest(
        `/api/user/addresses/${editingAddressId}/default/remove`,
        {
          method: "PATCH",
          token
        }
      );

      setAddresses(data.addresses || []);
      toast.info(data.message);
      resetForm();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Profile updates are lightweight by design: name changes are common, password changes are optional.
  const handleProfileSave = async (event) => {
    event.preventDefault();

    const form = event.target;
    const password = form.password.value.trim();

    try {
      const data = await apiRequest("/api/user/me", {
        method: "PUT",
        token,
        body: JSON.stringify({
          name: form.name.value,
          password: password || undefined
        })
      });

      updateUser(data.user);
      form.password.value = "";
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <div className="dashboard-panel">
            <h1>Loading dashboard...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <aside className="dashboard-sidebar">
          <div className="dashboard-user">
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
          </div>

          <div className="dashboard-menu">
            <button
              className={`menu-item ${activeTab === "addresses" ? "active" : ""}`}
              onClick={() => switchTab("addresses")}
            >
              Addresses
            </button>

            <button
              className={`menu-item ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => switchTab("orders")}
            >
              Orders
            </button>

            <button
              className={`menu-item ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => switchTab("profile")}
            >
              Edit Profile
            </button>
          </div>
        </aside>

        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <h1>{sectionMeta[activeTab].title}</h1>
              <p>{sectionMeta[activeTab].description}</p>
            </div>

            {activeTab === "addresses" && !showForm && (
              <button
                className="dashboard-primary-btn"
                onClick={() => setShowForm(true)}
              >
                Add Address
              </button>
            )}

            {activeTab === "orders" && (
              <button
                className="dashboard-secondary-btn"
                onClick={() => navigate("/")}
              >
                Browse Canteens
              </button>
            )}
          </div>

          {activeTab === "addresses" && (
            <>
              {addresses.length === 0 && !showForm && (
                <div className="dashboard-empty-state">
                  <h3>No saved addresses yet</h3>
                  <p>Add your hostel block, floor, and room so checkout stays simple.</p>
                  <button onClick={() => setShowForm(true)}>
                    Add New Address
                  </button>
                </div>
              )}

              {showForm && (
                <form className="address-form" onSubmit={handleSaveAddress}>
                  <div className="form-heading">
                    <h2>{editingAddressId ? "Edit Address" : "Add New Address"}</h2>
                    <p>Enter the address where your order should be delivered.</p>
                  </div>

                  <div className="form-group">
                    <label>Name</label>
                    <input
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Mobile Number</label>
                    <input
                      name="phone"
                      maxLength="10"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Hostel Block</label>
                    <select
                      name="block"
                      required
                      value={formData.block}
                      onChange={handleChange}
                    >
                      <option value="">Select Block</option>
                      <option>A Block</option>
                      <option>B Block</option>
                      <option>C Block</option>
                      <option>D Block</option>
                    </select>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Floor</label>
                      <input
                        name="floor"
                        type="number"
                        required
                        value={formData.floor}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Room</label>
                      <input
                        name="room"
                        type="number"
                        required
                        value={formData.room}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-buttons">
                    <button type="submit" className="save-address-btn">
                      Save Address
                    </button>

                    {editingAddressId &&
                      addresses.find((address) => address._id === editingAddressId)?.isDefault && (
                        <button
                          type="button"
                          className="remove-default-btn"
                          onClick={removeDefaultAddress}
                        >
                          Remove Default
                        </button>
                      )}

                    <button
                      type="button"
                      className="edit-btn"
                      onClick={resetForm}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {addresses.length > 0 && (
                <div className="address-grid">
                  {addresses.map((address) => (
                    <div className="saved-address" key={address._id}>
                      {address.isDefault && (
                        <div className="default-label">Default Address</div>
                      )}

                      <h3>
                        {address.block} • Floor {address.floor} • Room {address.room}
                      </h3>
                      <p className="address-name">{address.name}</p>
                      <p className="address-phone">{address.phone}</p>

                      <div className="address-actions">
                        {!address.isDefault && (
                          <button
                            className="default-btn"
                            onClick={() => setDefaultAddress(address._id)}
                          >
                            Set Default
                          </button>
                        )}

                        <button className="edit-btn" onClick={() => handleEdit(address)}>
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => setAddressPendingDelete(address)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "orders" && (
            <>
              {orders.length === 0 ? (
                <div className="dashboard-empty-state">
                  <h3>No orders yet</h3>
                  <p>Your completed orders will appear here.</p>
                  <button onClick={() => navigate("/")}>Start Ordering</button>
                </div>
              ) : (
                <div className="orders-grid">
                  {orders.map((order) => (
                    <div className="order-card" key={order._id}>
                      <div className="order-header">
                        <span className="order-id">
                          Order #{order._id.slice(-6).toUpperCase()}
                        </span>
                        <span className="order-status">{order.status}</span>
                      </div>

                      <p className="order-date">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>

                      <div className="order-items">
                        {order.items.map((item, index) => (
                          <div className="order-item" key={`${order._id}-${index}`}>
                            <span>{item.name} x{item.quantity}</span>
                            <span>₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="order-meta">
                        <div>
                          <span>Payment</span>
                          <strong>{order.paymentMethod}</strong>
                        </div>
                        <div>
                          <span>Total</span>
                          <strong>₹{order.total}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "profile" && (
            <form className="profile-form" onSubmit={handleProfileSave}>
              <div className="form-heading">
                <h2>Edit Profile</h2>
                <p>Update your name or password.</p>
              </div>

              <div className="form-group">
                <label>Full Name</label>
                <input
                  name="name"
                  defaultValue={user?.name}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input value={user?.email || ""} readOnly />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Enter new password"
                />
              </div>

              <button type="submit" className="save-profile-btn">
                Save Changes
              </button>
            </form>
          )}
        </section>
      </div>

      {addressPendingDelete && (
        <div
          className="dashboard-modal-overlay"
          onClick={() => setAddressPendingDelete(null)}
        >
          {/* The confirm modal repeats the address details so users know exactly what they are deleting. */}
          <div
            className="dashboard-confirm-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="dashboard-confirm-tag">Delete Address</span>
            <h3>Remove this saved address?</h3>
            <p>
              {addressPendingDelete.block} • Floor {addressPendingDelete.floor} • Room {addressPendingDelete.room}
            </p>
            <p className="dashboard-confirm-note">
              This action cannot be undone.
            </p>

            <div className="dashboard-confirm-actions">
              <button
                type="button"
                className="edit-btn"
                onClick={() => setAddressPendingDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="delete-btn"
                onClick={() => handleDelete(addressPendingDelete._id)}
              >
                Delete Address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
