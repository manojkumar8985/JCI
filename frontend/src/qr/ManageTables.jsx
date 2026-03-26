import { Box, TableContainer, Table, TableHead, TableRow, TableCell, Switch, TableBody, Paper, Button } from "@mui/material";
import AdminHeaderComponent from "../components/mainComponents/AdminHeaderComponent";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LsService from "../services/localstorage";
import { collection, query, where, getDocs, updateDoc, doc, orderBy } from "firebase/firestore";
import { db } from "../services/firebase";
import AddTables from "./AddTables";
import QRCodeModal from "../Pages/QRCodeModal";

const headCellStyle = {
    color: "white",
    fontWeight: 'bold',
}

const ManageTables = () => {
    const [tablesList, setTablesList] = useState([]);
    const [openQR, setOpenQR] = useState(false);
    const [qrID, setQrID] = useState("");
    const navigate = useNavigate();

    const user = LsService.getItem("user");

    useEffect(() => {
        // console.log(user);

        if (user.type !== "admin") {
            // console.log("not loggedin");
            LsService.removeItem("user");
            navigate("/");
        }
        fetchTablesData();
    }, []);

    const fetchTablesData = async () => {
        try {
            const tablesCollection = collection(db, "table");
            const q = query(tablesCollection,
                orderBy("createdAt", "desc")
            );
            const querySnapshot = await getDocs(q);

            const fetchedtables = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
            }));
            setTablesList(fetchedtables);
        } catch (error) {
            console.error("Error fetching tables list:", error);
        }
    };

    const toggleUsageStatus = async (id, currentStatus) => {
        try {
            const tableRef = doc(db, "table", id);
            await updateDoc(tableRef, { active: !currentStatus });
            fetchTablesData(); // Refresh data after update
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleCloseQR = () => {
        setOpenQR(false);
    };

    const onDisplayQR = (qr_id) => {
        // console.log(qr_id);
        setQrID(qr_id);
        setOpenQR(true);
    }
    return (
        <Box sx={{
            background: "black",
            minHeight: "100vh",
        }}>
            <AdminHeaderComponent />
            <Box sx={{ height: "10vh" }} ></Box>
            <Box sx={{
                width: { xs: "100vw", md: "98.93vw" },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: { md: "center", xs: "start" },
                color: "white",
                py: 2,
            }}
            >
                <AddTables fetchTablesData={fetchTablesData} />
                <Box p={1} />
                <QRCodeModal open={openQR} onClose={handleCloseQR} qrid={qrID} />
                <TableContainer component={Paper} sx={{ maxWidth: { xs: "100%", md: "60%" } }}>
                    <Table>
                        <TableHead sx={{ backgroundColor: "#3e8596" }}>
                            <TableRow>
                                <TableCell sx={headCellStyle}>Created At</TableCell>
                                <TableCell sx={headCellStyle}>Table Name</TableCell>
                                <TableCell sx={headCellStyle}>Table QR</TableCell>
                                <TableCell sx={headCellStyle}>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tablesList.map((table, index) => (
                                <TableRow
                                    key={index}
                                    sx={{
                                        backgroundColor: index % 2 === 0 ? "white" : "lightgrey",
                                        "&:hover td": {
                                            color: "green",
                                        },
                                    }}
                                >
                                    <TableCell>{table.createdAt}</TableCell>
                                    <TableCell>{table.table_name}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={() => onDisplayQR(table.table_id)}
                                        >QR Code</Button>
                                    </TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={table.active}
                                            onChange={() => toggleUsageStatus(table.table_id, table.active)}
                                            color="primary"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    )
}
export default ManageTables;