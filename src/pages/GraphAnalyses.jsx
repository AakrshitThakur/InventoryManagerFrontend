import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CheckDarkMode } from "../JS_Utils/CheckDarkMode";
import axios from "axios";
import "../CSS/GraphAnalyses.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

let inc = 1;
export default function GraphAnalyses() {
  const [GraphAnalysesData, SetGraphAnalysesData] = useState([]);
  const [PieChartData, SetPieChartData] = useState({});
  const [IsDarkModeActive, SetIsDarkModeActive] = useState(false);

  // Colors needed for pie chart
  const COLORS = ["#013357", "#f4930d"];

  const { id, CategoryID } = useParams();

  useEffect(() => {
    // Setting observer to check HTML dark class
    const observer = CheckDarkMode(SetIsDarkModeActive);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const FetchAPI = async () => {
      try {
        const response = await axios.get(
          `https://inventorymanagerbackend.onrender.com/shops/${id}/stockroom/categories/${CategoryID}/GraphAnalyses`,
          { withCredentials: true }
        );
        if (response.data.AuthenticationError) {
          // Authentication error
          // Navigate to '/shops' if an authentication verification issue is detected.
          navigate("/shops", {
            state: {
              msg: response.data.AuthenticationError.msg,
              status: response.data.AuthenticationError.status,
            },
          });
        } else if (response.data.AuthorizationError) {
          // Authorization error
          // Navigate to '/shops' if an authorization issue is detected.
          navigate("/shops", {
            state: {
              msg: response.data.AuthorizationError.msg,
              status: response.data.AuthorizationError.status,
            },
          });
        } else if (response.data.GeneralError) {
          navigate("/GeneralError", {
            state: {
              msg:
                response.data.GeneralError.msg || "Oops! Something went wrong",
              StatusCode: response.data.GeneralError.StatusCode,
            },
          });
        } else if (response.data.GraphAnalysesData) {
          SetGraphAnalysesData(response.data.GraphAnalysesData);
          let CountAvailabelStock = 0,
            CountAvailablePayment = 0,
            CountTotalItems = 0;
          for (const item of response.data.GraphAnalysesData) {
            CountTotalItems++;
            if (item.StockStatus == "Available") CountAvailabelStock++;
            if (item.PaymentStatus == "Available") CountAvailablePayment++;
          }
          SetPieChartData({
            StockData: [
              {
                name: "StockAvailable",
                value: CountAvailabelStock,
              },
              {
                name: "StockNotAvailable",
                value: CountTotalItems - CountAvailabelStock,
              },
            ],
            PaymentData: [
              {
                name: "PaymentAvailable",
                value: CountAvailablePayment,
              },
              {
                name: "PaymentNotAvailable",
                value: CountTotalItems - CountAvailablePayment,
              },
            ],
          });
        }
      } catch (FrontendError) {
        console.error(FrontendError.message);
        navigate("/GeneralError", {
          state: {
            msg: FrontendError.message || "Oops! Something went wrong",
            StatusCode: FrontendError.StatusCode,
          },
        });
      }
    };
    FetchAPI();
  }, []);

  return (
    <div className="GraphicalAnalysis flex-1 flex flex-col justify-center items-center">
      <div
        className={
          IsDarkModeActive
            ? "BoxAtDark w-full sm:w-3/4 md:w-2/3 lg:w-3/5 m-1 p-1 md:p-2 rounded"
            : "BoxShadowAtLight w-full sm:w-3/4 md:w-2/3 lg:w-3/5 m-1 p-1 md:p-2 rounded"
        }
      >
        <h1 className="text-nowrap text-2xl md:text-3xl lg:text-4xl mb-1 sm:mb-2">
          Viewing all graphs
        </h1>
        <div>
          <button className="block w-full text-xs md:text-sm lg:text-md PrussianBlueColor text-white rounded px-1 py-1 md:px-2 md:py-2 mb-1">
            <a
              className="w-full text-nowrap text-xs md:text-sm lg:text-md"
              href={`/shops/${id}/stockroom/categories/${CategoryID}/new`}
            >
              Create new item
            </a>
          </button>
        </div>
        <div>
          <button className="block w-full text-xs md:text-sm lg:text-md TangerineColor text-black rounded px-1 py-1 md:px-2 md:py-2 mb-1">
            <a
              className="w-full text-nowrap text-xs md:text-sm lg:text-md"
              href={`/shops/${id}/stockroom/categories/${CategoryID}`}
            >
              Go back
            </a>
          </button>
        </div>
        {GraphAnalysesData.length == 0 ? (
          <div className="leading-none text-xs md:text-sm lg:text-md">
            <p>Please add items in this category to view graph analyses</p>
          </div>
        ) : (
          <ul>
            <li
              className={
                IsDarkModeActive
                  ? "BoxAtDark container mx-auto mb-1 p-1 rounded"
                  : "BoxAtLight container mx-auto mb-1 p-1 rounded"
              }
              key={inc++}
            >
              <h2 className="text-nowrap text-lg md:text-xl lg:text-2xl">
                PerItemSellingPrice bargraph
              </h2>
              {IsDarkModeActive ? (
                <div className="w-full h-40 sm:h-60 md:h-80 text-xs md:text-sm lg:text-md text-black">
                  <ResponsiveContainer width="100%">
                    <BarChart
                      width="100%"
                      height="100%"
                      data={GraphAnalysesData}
                      margin={{
                        top: 5,
                        right: 5,
                        left: 5,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="10 10" />
                      <XAxis dataKey="ItemName" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="PerItemSellingPrice" fill="#f4930d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="w-full h-40 sm:h-60 md:h-80 text-xs md:text-sm lg:text-md">
                  <ResponsiveContainer width="100%">
                    <BarChart
                      width="100%"
                      height="100%"
                      data={GraphAnalysesData}
                      margin={{
                        top: 5,
                        right: 5,
                        left: 5,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="10 10" />
                      <XAxis dataKey="ItemName" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="PerItemPurchasePrice" fill="#013357" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </li>
            <li
              className={
                IsDarkModeActive
                  ? "BoxAtDark container mx-auto  mb-1 p-1 rounded"
                  : "BoxAtLight container mx-auto  mb-1 p-1 rounded"
              }
              key={inc++}
            >
              <h2 className="text-nowrap text-lg md:text-xl lg:text-2xl">
                PerItemSellingPrice bargraph
              </h2>
              {IsDarkModeActive ? (
                <div className="w-full h-40 sm:h-60 md:h-80 text-xs md:text-sm lg:text-md text-black">
                  <ResponsiveContainer width="100%">
                    <BarChart
                      width="100%"
                      height="100%"
                      data={GraphAnalysesData}
                      margin={{
                        top: 5,
                        right: 5,
                        left: 5,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="10 10" />
                      <XAxis dataKey="ItemName" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="PerItemSellingPrice" fill="#f4930d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="w-full h-40 sm:h-60 md:h-80 text-xs md:text-sm lg:text-md">
                  <ResponsiveContainer width="100%">
                    <BarChart
                      width="100%"
                      height="100%"
                      data={GraphAnalysesData}
                      margin={{
                        top: 5,
                        right: 5,
                        left: 5,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="10 10" />
                      <XAxis dataKey="ItemName" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="PerItemSellingPrice" fill="#013357" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </li>
            <li
              className={
                IsDarkModeActive
                  ? "BoxAtDark container mx-auto  mb-1 p-1 rounded"
                  : "BoxAtLight container mx-auto  mb-1 p-1 rounded"
              }
              key={inc++}
            >
              <h2 className="text-nowrap text-lg md:text-xl lg:text-2xl">
                PerItemSellingDiscount bargraph
              </h2>
              {IsDarkModeActive ? (
                <div className="w-full h-40 sm:h-60 md:h-80 text-xs md:text-sm lg:text-md text-black">
                  <ResponsiveContainer width="100%">
                    <BarChart
                      width="100%"
                      height="100%"
                      data={GraphAnalysesData}
                      margin={{
                        top: 5,
                        right: 5,
                        left: 5,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="10 10" />
                      <XAxis dataKey="ItemName" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="PerItemSellingDiscount" fill="#f4930d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="w-full h-40 sm:h-60 md:h-80 text-xs md:text-sm lg:text-md">
                  <ResponsiveContainer width="100%">
                    <BarChart
                      width="100%"
                      height="100%"
                      data={GraphAnalysesData}
                      margin={{
                        top: 5,
                        right: 5,
                        left: 5,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="10 10" />
                      <XAxis dataKey="ItemName" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="PerItemSellingDiscount" fill="#013357" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </li>
            <li
              className={
                IsDarkModeActive
                  ? "BoxAtDark container mx-auto  mb-1 p-1 rounded"
                  : "BoxAtLight container mx-auto  mb-1 p-1 rounded"
              }
              key={inc++}
            >
              <h2 className="text-nowrap text-lg md:text-xl lg:text-2xl">
                NoOfItems bargraph
              </h2>
              {IsDarkModeActive ? (
                <div className="w-full h-40 sm:h-60 md:h-80 text-xs md:text-sm lg:text-md text-black">
                  <ResponsiveContainer width="100%">
                    <BarChart
                      width="100%"
                      height="100%"
                      data={GraphAnalysesData}
                      margin={{
                        top: 5,
                        right: 5,
                        left: 5,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="10 10" />
                      <XAxis dataKey="ItemName" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="NoOfItems" fill="#f4930d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="w-full h-40 sm:h-60 md:h-80 text-xs md:text-sm lg:text-md">
                  <ResponsiveContainer width="100%">
                    <BarChart
                      width="100%"
                      height="100%"
                      data={GraphAnalysesData}
                      margin={{
                        top: 5,
                        right: 5,
                        left: 5,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="10 10" />
                      <XAxis dataKey="ItemName" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="NoOfItems" fill="#013357" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </li>
            <li
              className={
                IsDarkModeActive
                  ? "BoxAtDark container mx-auto  mb-1 p-1 rounded"
                  : "BoxAtLight container mx-auto  mb-1 p-1 rounded"
              }
              key={inc++}
            >
              <h2 className="text-nowrap text-lg md:text-xl lg:text-2xl">
                StockStatus piechart
              </h2>
              <div className="w-full h-40 sm:h-60 md:h-80 text-xs md:text-sm lg:text-md text-black">
                <ResponsiveContainer width="100%">
                  <PieChart width="100%" height="100%">
                    <Pie
                      data={PieChartData.StockData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius="75%"
                      stroke="none"
                      label={(elm) => `${elm.name}: ${elm.value}`}
                    >
                      {PieChartData.StockData.map((elm, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                    <CartesianGrid strokeDasharray="10 10" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </li>
            <li
              className={
                IsDarkModeActive
                  ? "BoxAtDark container mx-auto  mb-1 p-1 rounded"
                  : "BoxAtLight container mx-auto  mb-1 p-1 rounded"
              }
              key={inc++}
            >
              <h2 className="text-nowrap text-lg md:text-xl lg:text-2xl">
                PaymentStatus piechart
              </h2>
              <div className="w-full h-40 sm:h-60 md:h-80 text-xs md:text-sm lg:text-md text-black">
                <ResponsiveContainer width="100%">
                  <PieChart width="100%" height="100%">
                    <Pie
                      data={PieChartData.PaymentData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius="75%"
                      stroke="none"
                      label={(elm) => `${elm.name}: ${elm.value}`}
                    >
                      {PieChartData.PaymentData.map((elm, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                    <CartesianGrid strokeDasharray="10 10" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}