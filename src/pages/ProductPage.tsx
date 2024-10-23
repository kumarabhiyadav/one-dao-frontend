import { useEffect, useState } from "react";
import { Search, Pencil, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { domain, endpoints } from "../api/api";
import { useAlert } from "../context/AlertContext";

interface Product {
  id: number;
  name: string;
  price: number;
  user: number;
}

const ProductDisplay = () => {
  const [, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([
    // { id: 1, name: "Laptop", price: 999.99 },
    // { id: 2, name: "Smartphone", price: 699.99 },
    // { id: 3, name: "Headphones", price: 199.99 },
    // { id: 4, name: "Monitor", price: 299.99 },
    // { id: 5, name: "Keyboard", price: 89.99 },
  ]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLogoutModelDialog, setisLogoutModelDialog] = useState(false);

  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditPrice(product.price.toString());
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (editingProduct) {
      let user = localStorage.getItem("userToken");
      let userparsed = await JSON.parse(user ?? "");
      if (userparsed) {
        let authToken = userparsed.token ?? "";
        await axios.put(
          domain + endpoints.updateProduct,
          {
            id:editingProduct.id,
            name: editName,
            price: parseFloat(editPrice),
          },
          { headers: { Authorization: "bearer " + authToken } }
        );
      }

      const updatedProducts = products.map((product) =>
        product.id === editingProduct.id
          ? { ...product, name: editName, price: parseFloat(editPrice) }
          : product
      );
      setProducts(updatedProducts);
      setIsEditDialogOpen(false);
      setEditingProduct(null);
    }
  };

  const handleDelete =async (id: number) => {
    let user = localStorage.getItem("userToken");
      let userparsed = await JSON.parse(user ?? "");
      if (userparsed) {
        let authToken = userparsed.token ?? "";

       console.log( domain + endpoints.deleteProduct+"/"+id)
        await axios.delete(
          domain + endpoints.deleteProduct+"/"+id,
         
          { headers: { Authorization: "bearer " + authToken } }
        );
      }
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts);
  };

  const logout = async () => {
    localStorage.removeItem("userToken");
    navigate("/login");
  };

  const handleLogout = () => {
    setisLogoutModelDialog(true);
  };

  useEffect(() => {
    // IIFE to handle the API call
    (async () => {
      true;
      setIsLoading(true);

      try {
        let user = localStorage.getItem("userToken");
        let userparsed = await JSON.parse(user ?? "");
        if (userparsed) {
          let authToken = userparsed.token ?? "";

          const response = await axios.get(domain + endpoints.getproduct, {
            headers: { Authorization: "bearer " + authToken },
          });

          if (response.data.success) {
            setProducts([...response.data.result]);
          } else
            showAlert({
              message: "Falied to fetch Products",
              title: "No products found",
              type: "error",
            });
        }
      } catch (err) {
        showAlert({
          message: "Falied to fetch Products",
          title: "No products found",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <div className="p-4 max-w-4xl mx-auto">
        {/* Search Bar */}
        <div className="mb-6 flex items-center justify-between">
          <div className="relative flex-1 mr-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={() => handleLogout()} // Add your logout logic here
            className="px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {product.name}
                </h3>
              </div>
              <div className="mb-4">
                <p className="text-2xl font-bold text-green-600">
                  ${product.price.toFixed(2)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Modal */}
        {isEditDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Edit Product</h2>
                <button
                  onClick={() => setIsEditDialogOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Product Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Price
                  </label>
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setIsEditDialogOpen(false)}
                  className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {isLogoutModelDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Logout</h2>
                <button
                  onClick={() => {
                    setisLogoutModelDialog(false);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => {
                    setisLogoutModelDialog(false);
                  }}
                  className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    logout();
                  }}
                  className="px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors"
                >
                  Confirm Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDisplay;
