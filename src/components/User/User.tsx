import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import IUser from "./../../models/User";
import { Link } from "react-router-dom";
import { Add } from "@material-ui/icons";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import classes from "./User.module.css";
import { History } from "history";
import DeleteConfirmation from "./DeleteConfirmation";
import Response from './../../models/Response';

interface Props {
  history: History;
}

interface Idialog {
  isOpen: boolean;
  title: string;
  subTitle: string;
  onConfirm(): void;
}

interface Iheadcell {
  id: string;
  label: string;
  disableSorting?: boolean;
}

const headCells: Iheadcell[] = [
  { id: "FirstName", label: "First Name" },
  { id: "LastName", label: "Last Name" },
  { id: "Email", label: "Email Address" },
  { id: "MobileNumber", label: "Mobile Number" },
  { id: "Address", label: "Address" },
  { id: "Action", label: "Action", disableSorting: true },
];

const User: React.FC<Props> = ({ history }) => {
  const pages = [2, 5, 25];
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(pages[page]);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("FirstName");
  const [records, setRecords] = useState<IUser[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [confirmDialog, setConfirmDialog] = useState<Idialog>({
    isOpen: false,
    title: "",
    subTitle: "",
    onConfirm: () => {}
  });

  useEffect(() => {
    getUserList(page, rowsPerPage, order, orderBy, search);
  }, []);

  const getUserList = (
    page: number,
    rowsPerPage: number,
    order: string,
    orderBy: string,
    search: string
  ) => {
    fetch("http://localhost:8080/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        page: page,
        rowsPerPage: rowsPerPage,
        order: order,
        orderBy: orderBy,
        search: search,
      }),
    })
      .then((result) => {
        return result.json();
      })
      .then((data: Response<IUser>) => {
        setRecords(data.data);
        setTotalRecords(data.totalRecord);
      });
  };

  const handleSortRequest = (cellId: string) => {
    const isAsc = orderBy === cellId && order === "asc";
    const Order = isAsc ? "desc" : "asc";
    setOrder(Order);
    setOrderBy(cellId);
    setPage(0);
    getUserList(0, rowsPerPage, Order, cellId, search);
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
    setPage(newPage);
    getUserList(newPage, rowsPerPage, order, orderBy, search);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    getUserList(0, parseInt(event.target.value, 10), order, orderBy, search);
  };

  const searchHandler = () => {
    setPage(0);
    setRowsPerPage(2);
    setOrder("asc");
    setOrderBy("FirstName");
    getUserList(0, 2, "asc", "FirstName", search);
  };

  const onDelete = (id: string) => {
    fetch("http://localhost:8080/delete-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((result) => {
        return result.json();
      })
      .then((data: Response<IUser>) => {
        if (data.success) {
          setConfirmDialog({
            ...confirmDialog,
            isOpen: false,
          });
          setPage(0);
          setOrder("asc");
          setOrderBy("FirstName");
          setSearch("");
          getUserList(0, rowsPerPage, "asc", "FirstName", "");
        }
      });
  };

  return (
    <Paper>
      <Box display="flex" justifyContent="space-between">
        <TextField
          label="Search"
          name="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={searchHandler}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Link to="/manage-user" className={classes.LinkUnderlineRemove}>
          <Button variant="contained" color="primary" startIcon={<Add />}>
            Add
          </Button>
        </Link>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  sortDirection={orderBy !== headCell.id ? order : false}
                >
                  {headCell.disableSorting ? (
                    headCell.label
                  ) : (
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : "asc"}
                      onClick={() => {
                        handleSortRequest(headCell.id);
                      }}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((item: IUser) => (
              <TableRow key={item._id}>
                <TableCell>{item.FirstName}</TableCell>
                <TableCell>{item.LastName}</TableCell>
                <TableCell>{item.Email}</TableCell>
                <TableCell>{item.MobileNumber}</TableCell>
                <TableCell>{item.Address}</TableCell>
                <TableCell>
                  <IconButton
                    className={classes.IconButton}
                    onClick={() =>
                        history.push("/manage-user/" + item._id)
                    }
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    className={classes.IconButton}
                    onClick={() => {
                      setConfirmDialog({
                        isOpen: true,
                        title: "Delete User",
                        subTitle: "Are you sure want to delete this User?",
                        onConfirm: () => {
                          onDelete(item._id);
                        },
                      });
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                page={page}
                rowsPerPageOptions={pages}
                rowsPerPage={rowsPerPage}
                count={totalRecords}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <DeleteConfirmation
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </Paper>
  );
};

export default User;
