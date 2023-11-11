import axios from "axios";
import { useForm } from "react-hook-form";
import { BsFillTrashFill } from 'react-icons/bs';
import { FiEdit2 } from 'react-icons/fi';
import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';

const Partnres = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const token = sessionStorage.getItem('token');
  const [editingId, setEditingId] = useState(null);
  const [data, setData] = useState([]);
  const [editFormData, setEditFormData] = useState({});

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("logo", data.logo[0]);
    formData.append("name", data.name);

    const options = {
      method: "POST",
      url: `https://api.abdullajonov.uz/legend-backend-api/api/admin/${token}/partners/store`,
      headers: {
        "Accept": "application/json",
      },
      data: formData,
    };
    try {
      const response = await axios(options);
      fetchData();
      toast.success('Partnres qo\'shildi', {
        position: toast.POSITION.TOP_RIGHT
      });
    } catch (error) {
      if (error.response && error.response.status === 422) {
        console.error("Validation Error:", error.response.data);
      } else {
        console.error(error);
      }
      toast.error('Partnres qo\'shilmadi', {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  }

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'https://api.abdullajonov.uz/legend-backend-api/api/partners/get',
      );
      const newsData = response.data.data;
      setData(newsData);
    } catch (error) {
      console.error(error);
    }
  };

  const onEdit = async (formData) => {
    const form = new FormData();
    if (formData.logo) {
      form.append("logo", formData.logo[0]);
      form.append("name", formData.name);

      const options = {
        method: 'POST',
        url: `https://api.abdullajonov.uz/legend-backend-api/api/admin/${token}/partners/${editingId}/update`,
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
        toast.success('Ijtimoiy tarmoq taxrirlandi', {
          position: toast.POSITION.TOP_RIGHT
        });
      } catch (error) {
        console.error(error);
      }
      toast.success('Ijtimoiy tarmoq taxrirlanmadi', {
        position: toast.POSITION.TOP_RIGHT
      });
    } else {
      console.error("formData.image is undefined.");
    }
  };

  const deleteNews = async (idToDelete) => {
    try {
      const response = await axios.delete(
        `https://api.abdullajonov.uz/legend-backend-api/api/admin/${token}/partners/${idToDelete}`,
        {
          headers: {
            "Accept": "application/json",
          }
        }
      );
      fetchData();
      toast.success('Ijtimoiy tarmoq o\'chirildi', {
        position: toast.POSITION.TOP_RIGHT
      });
    } catch (error) {
      console.error(error);
    }
    toast.success('Ijtimoiy tarmoq o\'chirilmadi', {
      position: toast.POSITION.TOP_RIGHT
    });
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
      <div className="md:mx-3 mt-16 mb-6 lg:mx-4">
        <div className="grid gap-4">
          <div className="flex flex-wrap gap-4 md:block">
            <form className="product_info" onSubmit={handleSubmit(onSubmit)}>
              <div className="items-center md:flex md:items-center">
                <input
                  type="file"
                  placeholder="image_upload"
                  className="w-[330px] ml-2 px-2 py-[3px] md:w-52 md:h-10 md:px-2 md:py-[3px] text-gray-600 border-2 border-[#dee2e6] bg-white rounded-lg md:focus:outline-none md:focus:border-blue-400 md:ml-5"
                  {...register("logo")}
                />
                <input
                  type="text"
                  placeholder="Nomi"
                  className="w-[330px] ml-2 mt-3 h-10 px-2 py-[3px] text-gray-600 border-2 border-[#dee2e6] bg-white rounded-lg md:w-52 md:h-10 md:px-2 md:py-[3px] md:text-gray-600 md:border-2 md:border-[#dee2e6] md:bg-white md:rounded-lg md:focus:outline-none md:focus:border-blue-400 md:mt-0 md:ml-5"
                  {...register("name")}
                />
                <button type="submit" className="w-[330px] ml-3 mt-3 ol-span-6 h-10 border-blue-400 bg-blue-500 text-white text-lg rounded-lg md:col-span-6 md:mt-0 md:w-52 md:h-10 md:border md:border-blue-400 md:bg-blue-500 md:text-white md:text-lg md:rounded-lg md:ml-5 ">
                  <span>Ma'lumotlarni yuborish</span>
                </button>
              </div>
            </form>

            <div className="ml-0 md:ml-1 max-h-[670px] overflow-y-auto">
              {Array.isArray(data) &&
                data.map((item) => (
                  <>
                    <div key={item.id} className="m-4 w-80 rounded-lg border border-gray-300 p-3">
                      <img
                        src={`https://api.abdullajonov.uz/legend-backend-api/public/storage/images/${item.logo}`}
                        alt=""
                        className="h-48 w-full rounded-t-lg object-cover"
                      />
                      <p className="text-18 my-2">{item.name}</p>
                      <div className="flex gap-12">
                        <button
                          className="w-48 h-10 bg-red-500 text-white text-17 rounded p-2 border border-red-500 flex items-center justify-center gap-5"
                          onClick={() => deleteNews(item.id)}
                        >
                          <BsFillTrashFill className="mr-2" />
                          Delete
                        </button>
                        <button
                          className=" w-48 h-10 bg-blue-500 text-white text-17 rounded p-2 border border-blue-500 flex items-center justify-center gap-5"
                          onClick={() => editNews(item)}
                        >
                          <FiEdit2 className="mr-2" />
                          Edit
                        </button>
                      </div>
                    </div>
                    <div className="editing_social_network">
                      {editingId !== null && editingId === item.id && (
                        <form onSubmit={handleSubmit(onEdit)}>
                          <input
                            type="file"
                            {...register("logo")}
                            className="w-[330px] ml-2 md:w-52 h-10 px-4 py-1 border-2 border-[#dee2e6] rounded-lg focus:outline-none focus:border-blue-400 placeholder-gray-600 md:ml-5"
                          />
                          <input
                            type="text"
                            defaultValue={item.name}
                            {...register("name")}
                            className="w-[330px] ml-2 mt-3 h-10 px-2 py-[3px] text-gray-600 border-2 border-[#dee2e6] bg-white rounded-lg md:w-52 md:h-10 md:px-2 md:py-[3px] md:text-gray-600 md:border-2 md:border-[#dee2e6] md:bg-white md:rounded-lg md:focus:outline-none md:focus:border-blue-400 md:mt-0 md:ml-5"
                          />
                          <button
                            onClick={() => onEdit(item.id, { name: item.name })}
                            className="w-[330px] ml-3 mt-3 ol-span-6 h-10 border-blue-400 bg-blue-500 text-white text-lg rounded-lg md:col-span-6 md:mt-0 md:w-52 md:h-10 md:border md:border-blue-400 md:bg-blue-500 md:text-white md:text-lg md:rounded-lg md:ml-5 "
                          >
                            <span>Save</span>
                          </button>
                        </form>

                      )}
                    </div>
                  </>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Partnres