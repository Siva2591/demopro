import { Button, Card, Switch, Tabs } from "antd";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../App";
import { Navigate, useNavigate } from "react-router-dom";

const HomePage = () => {
  const [notification, setNotification] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) navigate("/login");
  }, []);

  const [file, setFile] = useState(null);

  const onChange = (checked, itemLabel) => {
    if (checked) {
      if (!notification.find((entry) => entry.label === itemLabel)) {
        setNotification([...notification, { label: itemLabel, value: true }]);
      }
    } else {
      setNotification(
        notification.filter((entry) => entry.label !== itemLabel)
      );
    }
  };

  const onSubmit = () => {
    const form = new FormData();
    form.append("file", file);
    form.append("notification", JSON.stringify(notification));

    axios
      .post("http://13.232.109.53:8000/upload-data", form)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  const items = [
    {
      key: "1",
      label: "SNOW",
      children: (
        <div className="flex items-center gap-4">
          <Switch
            checked={notification.find((entry) => entry.label === "SNOW")}
            className="bg-gray-300"
            onChange={(checked) => onChange(checked, "SNOW")}
          />{" "}
          Attached SOW
        </div>
      ),
    },
    {
      key: "2",
      label: "GSL",
      children: (
        <div className="flex items-center gap-4">
          <Switch
            className="bg-gray-300"
            onChange={(checked) => onChange(checked, "GSL ID Generated")}
          />{" "}
          GSL ID Generated
        </div>
      ),
    },
    {
      key: "3",
      label: "ALIGN",
      children: (
        <div className="flex items-center gap-4">
          <Switch
            className="bg-gray-300"
            onChange={(checked) => onChange(checked, "Email Excel")}
          />{" "}
          Email Excel
        </div>
      ),
    },
    {
      key: "4",
      label: "SNOW FLAKE",
      children: (
        <div className="flex items-center gap-4">
          <Switch
            className="bg-gray-300"
            onChange={(checked) => onChange(checked, "Email Trigger")}
          />{" "}
          Email Trigger
        </div>
      ),
    },
  ];

  const settingsItems = [
    {
      key: "1",
      label: "Setting",
      children: <div className="flex items-center gap-4">Setting</div>,
    },
    {
      key: "2",
      label: "Profile",
      children: <div className="flex items-center gap-4">Profile</div>,
    },
    {
      key: "3",
      label: "Contact",
      children: <div className="flex items-center gap-4">Contact</div>,
    },
  ];

  return (
    <div className="">
      <Navbar />
      <main className="grid w-full h-full grid-cols-2 gap-3 p-3">
        <div className="flex flex-col justify-between gap-4">
          <Card color="white" className="shadow-lg">
            <Tabs defaultActiveKey="1" items={items} />
          </Card>
          <Card title={"Settings"} color="white" className="shadow-lg">
            <Tabs defaultActiveKey="1" items={settingsItems} />
          </Card>
        </div>
        <div className="flex flex-col gap-4">
          <Card title={"Notification"} className="shadow-lg">
            {notification.reverse().map((entry, index) => (
              <div
                key={index}
                className="px-4 py-1 my-2 text-lg bg-green-300 rounded-md"
              >
                {entry.label}
              </div>
            ))}
          </Card>
          <Card title={"Request"} className="shadow-lg">
            <div>
              File Upload{" "}
              <input onChange={(e) => setFile(e.target.files[0])} type="file" />
            </div>
          </Card>
        </div>
        <div className="flex gap-4 w-60">
          <Button
            className="bg-blue-400 hover:!bg-blue-500 text-white hover:!text-white"
            onClick={onSubmit}
          >
            Cancel
          </Button>
          <Button
            className="bg-blue-400 hover:!bg-blue-500 text-white hover:!text-white"
            onClick={onSubmit}
          >
            Submit
          </Button>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
