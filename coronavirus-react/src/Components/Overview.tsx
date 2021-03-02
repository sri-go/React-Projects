import React from 'react'


interface OverviewProps {
    name: string
    date: Date
    confirmedTotal: number
    deathsTotal: number
}

const Overview = (props: OverviewProps) => {
    const {name, date, confirmedTotal, deathsTotal} = props
    return (
        <div>
              <div
                style={{ margin: "0px auto", maxWidth: "350px", width: "100%" }}>
                <h1
                  className="h1"
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontWeight: "normal",
                    fontSize: "30px",
                    marginTop: "0px",
                  }}
                >
                  {name} Coronavirus Situation as of{" "}
                  {date.toLocaleDateString("default")}
                </h1>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  textAlign: "center",
                  margin: "10px 0 0 0",
                }}
              >
                <div style={{ border: "3px solid", borderRadius: "15px" }}>
                  <h5
                    style={{ padding: "10px", margin: "0px", color: "white" }}
                  >
                    Total Confirmed Cases: <br />
                    {confirmedTotal.toLocaleString()}
                  </h5>
                </div>
                <div style={{ border: "3px solid", borderRadius: "15px" }}>
                  <h5
                    style={{ padding: "10px", margin: "0px", color: "white" }}
                  >
                    Total Deaths: <br />
                    {deathsTotal.toLocaleString()}
                  </h5>
                </div>
              </div>
            </div>
    )
}

export default Overview;