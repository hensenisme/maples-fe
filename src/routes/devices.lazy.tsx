import { useState, useEffect } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useNavigate, useLocation } from "@tanstack/react-router";
import axios from "axios";
import * as XLSX from "xlsx"; // Import XLSX for reading Excel files

const API_URL = "http://localhost:3000/api/tools";

export const Route = createLazyFileRoute("/devices")({
  component: Software,
});

function Software() {
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
  const handleExcelFile = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Process JSON data here (format: [{Nama Komponen, Quantity, Stock, Deskripsi}])
      const components = jsonData.map((item) => ({
        name: item["Nama Komponen"],
        quantity: item["Quantity"],
        stock: item["Stock"],
        description: item["Deskripsi"],
      }));

      setNewTool({
        ...newTool,
        components: components, // Set the components from Excel data
      });
    };

    reader.readAsArrayBuffer(file);
  };

  const handleToolClick = (tool) => {
    navigate(`/software#${tool.name}`);
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
    navigate("/software");
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

  return (
    <div className="container">
      <h1 className="mt-4">Menu Devices</h1>

      <div className="d-flex justify-content-end mb-4">
        <button className="btn btn-primary" onClick={handleAddNewTool}>
          Add New Tool
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
          <h2>Details for {selectedTool.name}</h2>
          <button className="btn btn-secondary mb-4" onClick={handleBackClick}>
            Back to All Tools
          </button>

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
              </tr>
            </thead>
            <tbody>
              {selectedTool.components.map((component, index) => (
                <tr key={index}>
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
                </tr>
              ))}
            </tbody>
          </table>
          {isEditing && (
            <div className="mb-4">
              <button
                className="btn btn-secondary me-2"
                onClick={handleAddComponentRow}
              >
                Add Component
              </button>
              <div className="d-flex justify-content-end">
                <button
                  className="btn btn-primary me-2"
                  onClick={handleSaveEdit}
                >
                  Save Changes
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {showForm && (
        <div className="mt-4">
          <h2>Add New Tool</h2>
          <div className="form-group">
            <label htmlFor="toolName">Tool Name</label>
            <input
              type="text"
              className="form-control"
              id="toolName"
              value={newTool.name}
              onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="toolImage">Tool Image URL</label>
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

          <h3 className="mt-4">Komponen</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Nama Komponen</th>
                <th>Quantity</th>
                <th>Stok</th>
                <th>Deskripsi</th>
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
                </tr>
              ))}
            </tbody>
          </table>

          {/* Input for uploading Excel file */}
          <div className="form-group mt-3">
            <label htmlFor="excelFile">Upload Excel File for Components</label>
            <input
              type="file"
              className="form-control"
              id="excelFile"
              accept=".xlsx, .xls"
              onChange={handleExcelFile} // Function to handle Excel file upload
            />
          </div>

          <button
            className="btn btn-secondary mb-3"
            onClick={handleAddNewComponent}
          >
            Add Component
          </button>

          <div className="d-flex justify-content-end">
            <button
              className="btn btn-primary me-2"
              onClick={handleSaveNewTool}
            >
              Save New Tool
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Software;
