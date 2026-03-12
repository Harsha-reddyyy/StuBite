import "./Dashboard.css";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

function Dashboard() {

  const user = JSON.parse(localStorage.getItem("stubiteUser")) || {};

  const [activeTab, setActiveTab] = useState("addresses");
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const [addresses, setAddresses] = useState(() => {
    const saved = localStorage.getItem("stubiteAddresses");
    return saved ? JSON.parse(saved) : [];
  });

  const [orders] = useState(() => {
    const saved = localStorage.getItem("stubiteOrders");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("stubiteAddresses", JSON.stringify(addresses));
  }, [addresses]);

  const handleSaveAddress = (e) => {

    e.preventDefault();

    const form = e.target;

    const newAddress = {
      name: form.name.value,
      phone: form.phone.value,
      block: form.block.value,
      floor: form.floor.value,
      room: form.room.value,
      isDefault: false
    };

    if (editingIndex !== null) {

      const updated = [...addresses];

      updated[editingIndex] = {
        ...newAddress,
        isDefault: addresses[editingIndex].isDefault
      };

      setAddresses(updated);
      setEditingIndex(null);

    } else {

      setAddresses([...addresses, newAddress]);

    }

    setShowForm(false);
    form.reset();

    toast.success("Address saved successfully 📍");
  };

  const setDefaultAddress = (index) => {

    const updated = addresses.map((addr, i) => ({
      ...addr,
      isDefault: i === index
    }));

    setAddresses(updated);

    toast.success("Default address updated");
  };

  const removeDefaultAddress = () => {

    if (editingIndex === null) return;

    const updated = [...addresses];
    updated[editingIndex].isDefault = false;

    setAddresses(updated);

    toast.info("Default address removed");
  };

  const handleEdit = (index) => {

    setEditingIndex(index);
    setShowForm(true);

    const addr = addresses[index];

    setTimeout(() => {

      const form = document.querySelector(".address-form");

      if (!form) return;

      form.name.value = addr.name;
      form.phone.value = addr.phone;
      form.block.value = addr.block;
      form.floor.value = addr.floor;
      form.room.value = addr.room;

    }, 50);
  };

  const handleDelete = (index) => {

    const confirmDelete = window.confirm("Delete this address?");
    if (!confirmDelete) return;

    const updated = addresses.filter((_, i) => i !== index);
    setAddresses(updated);
    toast.error("Address deleted");
  };

  const handleProfileSave = (e) => {

    e.preventDefault();

    const form = e.target;

    const updatedUser = {
      ...user,
      name: form.name.value,
      password: form.password.value
    };

    localStorage.setItem(
      "stubiteUser",
      JSON.stringify(updatedUser)
    );

    toast.success("Profile updated successfully 🎉");
  };

  return (

    <div className="dashboard-page">

      <div className="dashboard-container">

        {/* SIDEBAR */}

        <div className="dashboard-sidebar">

          <div className="dashboard-user">

            <h2>{user?.name}</h2>

            <p>
              {user?.email?.length > 42
                ? user.email.slice(0, 42) + "..."
                : user.email}
            </p>

          </div>

          <div className="dashboard-menu">

            <div
              className={`menu-item ${activeTab === "addresses" ? "active" : ""}`}
              onClick={() => setActiveTab("addresses")}
            >
              Addresses
            </div>

            <div
              className={`menu-item ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              Orders
            </div>

            <div
              className={`menu-item ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              Edit Profile
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="dashboard-content">

          {/* ADDRESSES */}

          {activeTab === "addresses" && (

            <>
              <h1>Your Addresses</h1>

              {addresses.length === 0 && !showForm && (

                <div className="address-box">

                  <p>No saved addresses yet.</p>

                  <button onClick={() => setShowForm(true)}>
                    Add New Address
                  </button>

                </div>

              )}

              {showForm && (

                <form className="address-form" onSubmit={handleSaveAddress}>

                  <h2>
                    {editingIndex !== null ? "Edit Address" : "Add New Address"}
                  </h2>

                  <div className="form-group">
                    <label>Name</label>
                    <input name="name" required />
                  </div>

                  <div className="form-group">
                    <label>Mobile Number</label>

                    <input
                      name="phone"
                      maxLength="10"
                      required
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, "")
                      }}
                    />

                  </div>

                  <div className="form-group">
                    <label>Hostel Block</label>

                    <select name="block" required>

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
                      <input name="floor" type="number" required />
                    </div>

                    <div className="form-group">
                      <label>Room</label>
                      <input name="room" type="number" required />
                    </div>

                  </div>

                  <div className="form-buttons">

                    <button type="submit" className="save-address-btn">
                      Save Address
                    </button>

                    {editingIndex !== null && addresses[editingIndex]?.isDefault && (

                      <button
                        type="button"
                        className="remove-default-btn"
                        onClick={removeDefaultAddress}
                      >
                        Remove Default
                      </button>

                    )}

                  </div>

                </form>

              )}

              {addresses.map((addr, index) => (

                <div className="saved-address" key={index}>

                  {addr.isDefault && (
                    <div className="default-label">
                      Default Address
                    </div>
                  )}

                  <h3>
                    📍 {addr.block} • Floor {addr.floor} • Room {addr.room}
                  </h3>

                  <p className="address-name">{addr.name}</p>
                  <p className="address-phone">{addr.phone}</p>

                  <div className="address-actions">

                    {!addr.isDefault && (
                      <button
                        className="default-btn"
                        onClick={() => setDefaultAddress(index)}
                      >
                        Set Default
                      </button>
                    )}

                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(index)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(index)}
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </>

          )}

          {/* ORDERS */}

          {activeTab === "orders" && (

            <>
              <h1>Your Orders</h1>

              {orders.length === 0 && (
                <p>No orders yet.</p>
              )}

              {orders.map((order) => (

                <div className="order-card" key={order.id}>

                  <div className="order-header">

                    <span className="order-id">
                      Order #{order.id}
                    </span>

                    <span className="order-status">
                      Delivered
                    </span>

                  </div>

                  <p className="order-date">{order.date}</p>

                  <div className="order-items">

                    {order.items.map((item, i) => (

                      <div className="order-item" key={i}>

                        <span>{item.name} x{item.quantity}</span>
                        <span>₹{item.price * item.quantity}</span>

                      </div>

                    ))}

                  </div>

                  <div className="order-total">

                    <span>Total</span>
                    <span>₹{order.total}</span>

                  </div>

                </div>

              ))}

            </>

          )}

          {/* EDIT PROFILE */}

          {activeTab === "profile" && (

            <>
              <h1>Edit Profile</h1>

              <form className="profile-form" onSubmit={handleProfileSave}>

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
                  <input
                    value={user?.email}
                    readOnly
                  />
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

            </>

          )}

        </div>

      </div>

    </div>

  );
}

export default Dashboard;