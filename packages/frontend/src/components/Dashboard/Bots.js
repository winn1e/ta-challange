import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import { isAxiosError } from "axios";
import Title from "./Title";
import { getBots, runBot } from "../../api/bots.service";

export default function Bots() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bots, setBots] = useState({});

  useEffect(() => {
    getBots()
      .then((data) => {
        const bots = data.reduce((map, bot) => {
          map[bot.id] = bot;
          return map;
        }, {});
        setBots(bots);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        if (isAxiosError(error) && error.response.status === 401) {
          localStorage.clear();
          navigate("/signin");
        }
      });
  }, [navigate]);

  const onRunBotClick = (id) => {
    const bot = bots[id];
    setBots({ ...bots, [id]: { ...bot, running: true } });

    runBot(id)
      .then((bot) => setBots({ ...bots, [id]: bot }))
      .catch((error) => {
        console.log(error);
        if (isAxiosError(error) && error.response.status === 401) {
          localStorage.clear();
          navigate("/signin");
        }
      });
  };

  return (
    <React.Fragment>
      <Title>Bots</Title>
      {loading ? (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Last Run</TableCell>
              <TableCell>Run By</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.values(bots).map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                {/* <TableCell>{row.running ? "Running" : "Idle"}</TableCell> */}
                <TableCell>
                  {row.lastRunDate
                    ? new Date(row.lastRunDate).toUTCString()
                    : "n/a"}
                </TableCell>
                <TableCell>{row.lastRunBy || "n/a"}</TableCell>
                <TableCell align="right">
                  {row.running ? (
                    <CircularProgress size={20} />
                  ) : (
                    <Button
                      size="small"
                      variant="contained"
                      endIcon={<PlayArrowIcon />}
                      onClick={() => onRunBotClick(row.id)}
                    >
                      Run
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </React.Fragment>
  );
}
