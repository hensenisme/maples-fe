import { useState, useEffect } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useNavigate, useLocation } from "@tanstack/react-router";
import axios from "axios";
import * as XLSX from "xlsx"; // Import XLSX for reading Excel files

const API_URL = "http://localhost:3000/api/tools";

export const Route = createLazyFileRoute("/devices")({
  component: Devices,
});

function Devices() {
  const [tools, setTools] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showForm, setShowForm] = useState(false); // Form visibility
  const [newTool, setNewTool] = useState({
    name: "",
    image: "",
    components: [],
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchTools();
  }, []);

  useEffect(() => {
    const toolNameFromHash = location.hash.slice(1);
    if (toolNameFromHash) {
      const foundTool = tools.find((tool) => tool.name === toolNameFromHash);
      if (foundTool) {
        setSelectedTool(foundTool);
      }
    } else {
      setSelectedTool(null);
    }
  }, [location.hash, tools]);

  const fetchTools = async () => {
    try {
      const response = await axios.get(API_URL);
      setTools(response.data);
    } catch (error) {
      console.error("Error fetching tools:", error);
    }
  };

  // Handler for reading Excel file and converting to JSON
  const handleExcelFile = async (e, toolToUpdate) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const components = jsonData.map((item) => ({
        name: item["Nama Komponen"],
        quantity: item["Quantity"],
        stock: item["Stock"],
        description: item["Deskripsi"],
      }));

      if (toolToUpdate) {
        // Editing mode, add components to selected tool
        setSelectedTool({
          ...selectedTool,
          components: [...selectedTool.components, ...components],
        });
      } else {
        // Creating a new tool, add components to new tool state
        setNewTool({
          ...newTool,
          components: [...newTool.components, ...components],
        });
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleToolClick = (tool) => {
    navigate(`/devices#${tool.name}`);
    setSelectedTool(tool);
    setShowActions(true);
  };

  const handleDeleteTool = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTools();
    } catch (error) {
      console.error("Error deleting tool:", error);
    }
  };

  const handleEditTool = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`${API_URL}/${selectedTool._id}`, selectedTool);
      setIsEditing(false);
      fetchTools();
      setShowActions(false);
    } catch (error) {
      console.error("Error saving tool:", error);
      alert(
        `Failed to save the tool. Error: ${error.response?.data?.message || error.message}`
      );
    }
  };

  const handleComponentChange = (index, field, value) => {
    const updatedComponents = [...selectedTool.components];
    updatedComponents[index][field] = value;
    setSelectedTool({ ...selectedTool, components: updatedComponents });
  };

  const handleAddComponentRow = () => {
    const updatedComponents = [
      ...selectedTool.components,
      { name: "", quantity: 0, stock: 0, description: "" },
    ];
    setSelectedTool({ ...selectedTool, components: updatedComponents });
  };

  const handleBackClick = () => {
    navigate("/devices");
    setSelectedTool(null);
    setShowActions(false);
  };

  const handleAddNewTool = () => {
    setShowForm(true);
    setNewTool({
      name: "",
      image: "",
      components: [],
    });
  };

  const handleSaveNewTool = async () => {
    try {
      await axios.post(API_URL, newTool);
      setShowForm(false); // Hide form after saving
      fetchTools(); // Refresh tools after adding new tool
    } catch (error) {
      console.error("Error saving new tool:", error);
      alert(
        `Failed to save the tool. Error: ${error.response?.data?.message || error.message}`
      );
    }
  };

  const handleAddNewComponent = () => {
    setNewTool({
      ...newTool,
      components: [
        ...newTool.components,
        { name: "", quantity: 0, stock: 0, description: "" },
      ],
    });
  };

  const handleNewComponentChange = (index, field, value) => {
    const updatedComponents = [...newTool.components];
    updatedComponents[index][field] = value;
    setNewTool({ ...newTool, components: updatedComponents });
  };

  const handleDeleteComponentRow = (index, toolToUpdate) => {
    const updatedComponents = [
      ...(toolToUpdate ? selectedTool.components : newTool.components),
    ];
    updatedComponents.splice(index, 1);
    if (toolToUpdate) {
      setSelectedTool({ ...selectedTool, components: updatedComponents });
    } else {
      setNewTool({ ...newTool, components: updatedComponents });
    }
  };

  return (
    <div className="container">
      <h1 className="mt-4">Menu Devices</h1>
      <div className="d-flex justify-content-end mb-4">
        <button className="btn btn-primary" onClick={handleAddNewTool}>
          Add New Devices
        </button>
      </div>

      {!selectedTool && !showForm && (
        <div className="row">
          {tools.map((tool) => (
            <div key={tool._id} className="col-md-4 mb-4">
              <div className="card">
                <img
                  src={tool.image}
                  alt={tool.name}
                  className="card-img-top tool-img"
                  onClick={() => handleToolClick(tool)}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{tool.name}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTool && (
        <div className="mt-4">
          <button className="btn btn-secondary mb-4" onClick={handleBackClick}>
            Back to All Devices
          </button>
          <h2>Details for {selectedTool.name}</h2>

          <div className="d-flex justify-content-between">
            <img
              src={selectedTool.image}
              alt={selectedTool.name}
              style={{ width: "200px" }}
            />
            {showActions && (
              <div>
                <button
                  className="btn btn-secondary me-2"
                  onClick={handleEditTool}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteTool(selectedTool._id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          <h3 className="mt-4">Komponen</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Nama Komponen</th>
                <th>Quantity</th>
                <th>Stok</th>
                <th>Deskripsi</th>
                {isEditing && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {selectedTool.components.map((component, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor:
                      component.stock >= component.quantity
                        ? "#D4EDDA"
                        : "#F8D7DA", // Light green or light red background
                    color:
                      component.stock >= component.quantity
                        ? "#155724"
                        : "#721C24",
                  }}
                >
                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control"
                        value={component.name}
                        onChange={(e) =>
                          handleComponentChange(index, "name", e.target.value)
                        }
                      />
                    ) : (
                      component.name
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        className="form-control"
                        value={component.quantity}
                        onChange={(e) =>
                          handleComponentChange(
                            index,
                            "quantity",
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      component.quantity
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        className="form-control"
                        value={component.stock}
                        onChange={(e) =>
                          handleComponentChange(index, "stock", e.target.value)
                        }
                      />
                    ) : (
                      component.stock
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control"
                        value={component.description}
                        onChange={(e) =>
                          handleComponentChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      component.description
                    )}
                  </td>
                  {isEditing && (
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteComponentRow(index, true)}
                      >
                        Delete Component
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {isEditing && (
            <>
              <button
                className="btn btn-success me-2"
                onClick={handleAddComponentRow}
              >
                Add New Component
              </button>
              <button className="btn btn-primary" onClick={handleSaveEdit}>
                Save Changes
              </button>
              <button
                className="btn btn-secondary ms-2"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </>
          )}

          <div className="mt-4">
            <label htmlFor="excelFile" className="form-label">
              Import Excel File for Components:
            </label>
            <input
              type="file"
              className="form-control"
              id="excelFile"
              onChange={(e) => handleExcelFile(e, selectedTool)}
            />
          </div>
        </div>
      )}

      {showForm && (
        <div className="mt-4">
          <h2>Add New Device</h2>
          <button
            className="btn btn-secondary mb-4"
            onClick={() => setShowForm(false)}
          >
            Cancel
          </button>
          <div className="mb-3">
            <label htmlFor="toolName" className="form-label">
              Device Name:
            </label>
            <input
              type="text"
              className="form-control"
              id="toolName"
              value={newTool.name}
              onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="toolImage" className="form-label">
              Image URL:
            </label>
            <input
              type="text"
              className="form-control"
              id="toolImage"
              value={newTool.image}
              onChange={(e) =>
                setNewTool({ ...newTool, image: e.target.value })
              }
            />
          </div>

          <h3>Components</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Component Name</th>
                <th>Quantity</th>
                <th>Stock</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {newTool.components.map((component, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={component.name}
                      onChange={(e) =>
                        handleNewComponentChange(index, "name", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      value={component.quantity}
                      onChange={(e) =>
                        handleNewComponentChange(
                          index,
                          "quantity",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      value={component.stock}
                      onChange={(e) =>
                        handleNewComponentChange(index, "stock", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={component.description}
                      onChange={(e) =>
                        handleNewComponentChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteComponentRow(index, false)}
                    >
                      Delete Component
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            className="btn btn-success me-2"
            onClick={handleAddNewComponent}
          >
            Add New Component
          </button>

          <div className="mt-4">
            <label htmlFor="newExcelFile" className="form-label">
              Import Excel File for Components:
            </label>
            <input
              type="file"
              className="form-control"
              id="newExcelFile"
              onChange={(e) => handleExcelFile(e)}
            />
          </div>

          <button className="btn btn-primary mt-4" onClick={handleSaveNewTool}>
            Save Device
          </button>
        </div>
      )}
    </div>
  );
}

export default Devices;
