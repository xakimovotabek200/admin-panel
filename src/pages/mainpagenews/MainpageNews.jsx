import axios from "axios";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Carousel } from 'react-responsive-carousel';

const MainpageNews = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const token = sessionStorage.getItem('token');
  const [editingId, setEditingId] = useState(null);
  const [data, setData] = useState([]);
  const [editFormData, setEditFormData] = useState({});

  const onSubmit = async (formData) => {
    const form = new FormData();
    form.append("image", formData.image[0]);
    form.append("text", formData.text);
    form.append("image_2", formData.image_2[0]);

    const options = {
      method: "POST",
      url: `https://api.abdullajonov.uz/legend-backend-api/api/admin/${token}/main-page-news/store`,
      headers: {
        "Accept": "application/json",
      },
      data: form,
    };

    try {
      const response = await axios(options);
      fetchData();
      toast.success('Asosiy sahifaga yangilik qo\'shildi', {
        position: toast.POSITION.TOP_RIGHT
      });
    } catch (error) {
      if (error.response && error.response.status === 422) {
        console.error("Validation Error:", error.response.data);
      } else {
        console.error(error);
      }
      toast.error('Asosiy sahifaga yangilik qo\'shilmadi', {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'https://api.abdullajonov.uz/legend-backend-api/api/main-page-news/get',
      );
      setData(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const onEdit = async (formData) => {
    const form = new FormData();
    if (formData.image) {
      form.append("image", formData.image[0]);
      form.append("image_2", formData.image_2[0]);
      form.append("text", formData.text);

      const options = {
        method: 'POST',
        url: `https://api.abdullajonov.uz/legend-backend-api/api/admin/${token}/main-page-news/${editingId}/update`,
        headers: {
          'Content-Type': 'multipart/form-data;',
          Accept: 'application/json'
        },
        data: form,
      };

      try {
        const response = await axios(options);
        setEditingId(null);
        fetchData();
        toast.success('Maxsulotni taxrirlash yakulandi', {
          position: toast.POSITION.TOP_RIGHT
        });
      } catch (error) {
        console.error(error);
        toast.error('Maxsulotni taxrirlash yakulanmadi', {
          position: toast.POSITION.TOP_RIGHT
        });
      }
    } else {
      console.error("formData.image is undefined.");
    }
  };

  const deleteNews = async (idToDelete) => {
    try {
      const response = await axios.delete(
        `https://api.abdullajonov.uz/legend-backend-api/api/admin/${token}/main-page-news/${idToDelete}/delete`,
        {
          headers: {
            "Accept": "application/json",
          }
        }
      );
      fetchData();
      toast.success('Maxsulotni o\'chirish yakulandi', {
        position: toast.POSITION.TOP_RIGHT
      });
    } catch (error) {
      console.error(error);
      toast.error('Maxsulotni o\'chirish yakulanmadi', {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };

  const editNews = (item) => {
    setEditFormData(item);
    setEditingId(item.id);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="mt-[8px] rounded-lg md:mt-10 mx-auto flex max-w-screen-lg flex-col gap-8 min-h-[840px] min-w-full bg-white shadow-2xl">
      <div className="mx-3 mt-16 mb-6 lg:mx-4">
        <div className="grid gap-4">
          <div className="flex flex-wrap gap-4 md:block">
            <form className="" onSubmit={handleSubmit(onSubmit)}>
              <div className="items-center md:flex">
                <input
                  type="file"
                  placeholder="image_upload_product"
                  className="w-[320px] ml-1 md:w-52 h-10 px-4 py-1 border-2 border-[#dee2e6] rounded-lg focus:outline-none focus:border-blue-400 text-gray-600 md:mt-0 md:ml-5"
                  {...register("image")}
                />
                <input
                  className="w-[320px] ml-1 mt-3 md:w-52 h-10 px-4 py-1 border-2 border-[#dee2e6] rounded-lg focus:outline-none focus:border-blue-400 text-gray-600 md:mt-0 md:ml-2"
                  type="file"
                  {...register("image_2")}
                />
                <input
                  type="text"
                  placeholder="Text"
                  className="w-[320px] ml-1 mt-3 md:w-52 h-10 px-4 py-2 border-2 border-[#dee2e6] rounded-lg focus:outline-none focus:border-blue-400 text-gray-600 md:mt-0 md:ml-2"
                  {...register("text")}
                />
                <button type="submit" className="w-[320px] ml-1 mt-3 md:col-span-6 md:w-52 h-10 border border-blue-400 bg-blue-500 text-white text-lg rounded-lg md:mt-0 md:ml-5">
                  <span>Ma'lumotlarni yuborish</span>
                </button>
              </div>
            </form>

            <div className="md:ml-5 max-h-[670px] overflow-y-auto md:flex md:gap-10">
              {Array.isArray(data) && data.map((item) => (
                <div key={item.id}>
                  <div className="w-[320px] flex-wrap md:w-[320px] md:h-72 border-2 border-[#dee2e6] flex items-center justify-evenly p-2 mt-3">
                    <Carousel className="w-full" showThumbs={false}>
                      <img
                        className="w-[320px] object-cover md:w-fullr h-40"
                        src={`https://api.abdullajonov.uz/legend-backend-api/public/storage/images/${item.image}`}
                        alt={item.title}
                      />
                      <img
                        className="w-[320px] object-cover md:w-20 h-32"
                        src={`https://api.abdullajonov.uz/legend-backend-api/public/storage/images/${item.image_2}`}
                        alt={item.title}
                      />
                    </Carousel>
                    <div className="flex mt-2 w-full md:flex items-center justify-center gap-5">
                      <p className="md:w-full font-bold text-gray-700">{item.text}</p>
                    </div>
                    <div className="mt-2 flex items-center justify-center gap-3 md:gap-5">
                      <button
                        className="w-[140px] md:w-32 h-10 px-4 py-2 border-2 border-blue-400 text-blue-600 rounded-lg flex items-center justify-evenly"
                        onClick={() => editNews(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="w-[140px] md:w-32 h-10 px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg flex items-center justify-evenly"
                        onClick={() => deleteNews(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                    <div className="md:w-full md:flex md:ml-0">
                      {editingId !== null && editingId === item.id && (
                        <form className="md:flex md:flex-wrap md:mt-14 md:ml-0" onSubmit={handleSubmit(onEdit)}>
                          <div className="items-center md:flex">
                            <input
                              type="file"
                              placeholder="image_upload_product"
                              className="w-[320px] ml-1 md:w-52 h-10 px-4 py-1 border-2 border-[#dee2e6] rounded-lg focus:outline-none focus:border-blue-400 text-gray-600 md:mt-0 md:ml-5"
                              {...register("image")}
                            />
                            <input
                              className="w-[320px] ml-1 mt-3 md:w-52 h-10 px-4 py-1 border-2 border-[#dee2e6] rounded-lg focus:outline-none focus:border-blue-400 text-gray-600 md:mt-0 md:ml-2"
                              type="file"
                              {...register("image_2")}
                            />
                            <input
                              type="text"
                              placeholder="Text"
                              className="w-[320px] ml-1 mt-3 md:w-52 h-10 px-4 py-2 border-2 border-[#dee2e6] rounded-lg focus:outline-none focus:border-blue-400 text-gray-600 md:mt-0 md:ml-2"
                              {...register("text")}
                            />
                            <button
                              className="w-[320px] ml-1 mt-3 md:col-span-6 md:w-52 h-10 border border-blue-400 bg-blue-500 text-white text-lg rounded-lg md:mt-0 md:ml-5"
                              onClick={() => onEdit(item.id, { name: item.text })}
                            >
                              Save
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default MainpageNews;
