import React, { useEffect, useState, useMemo } from "react";
import { Table, Button, Row, Col, Modal, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "../css/Search.css";
import {
  listEmployee,
  createEmployee,
  updateEmployee,
} from "../actions/employeeActions";

import { INVENTORYLEVEL_CREATE_RESET } from "../constants/inventoryLevelConstants";
import { INVENTORYLEVEL_UPDATE_RESET } from "../constants/inventoryLevelConstants";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Select from "react-select";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(18),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(18),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: "bottom",
    height: 20,
    width: 20,
  },
  details: {
    alignItems: "center",
  },
  column: {
    flexBasis: "33.33%",
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2),
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

const SalaryListScreen = ({ history, match }) => {
  const [show, setShow] = useState(false);
  const [updateShow, setUpdateShow] = useState(false);
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [salaryId, setSalaryId] = useState("");
  const [salary, setSalary] = useState(0);
  const [jobTitle, setJobTitle] = useState("");
  const [dateEmployeed, setDateEmployeed] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [employeed, setEmployeed] = useState(true);
  const [updatedSalary, setUpdatedSalary] = useState(0);
  const [updatedJobTitle, setUpdatedJobTitle] = useState("");
  const [updatedId, setUpdatedId] = useState("");
  const [updatedStartDate, setUpdatedStartDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [updatedEndDate, setUpdatedEndDate] = useState("");
  const [offDays, setOffDays] = useState(0);
  const [mongoId, setMongoId] = useState("");
  const [id, setId] = useState("");

  const classes = useStyles();
  const dispatch = useDispatch();

  const employeeList = useSelector((state) => state.employeeList);
  const {
    loading: loadingEmployeeList,
    // error: errorEmployeeList,
    // success: successEmployeeList,
    employee,
  } = employeeList;

  const employeeCreate = useSelector((state) => state.employeeCreate);
  const {
    // loading: loadingEmployeeCreate,
    error: errorEmployeeCreate,
    success: successEmployeeCreate,
  } = employeeCreate;

  const employeeUpdate = useSelector((state) => state.employeeUpdate);
  const {
    // loading: loadingEmployeeUpdate,
    // error: errorEmployeeUpdate,
    success: successEmployeeUpdate,
  } = employeeUpdate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      history.push("/login");
    } else {
      dispatch(listEmployee());
    }

    if (successEmployeeCreate || successEmployeeUpdate) {
      dispatch({ type: INVENTORYLEVEL_CREATE_RESET });
      dispatch({ type: INVENTORYLEVEL_UPDATE_RESET });
      history.push("/admin/salarylist");
      setFName("");
      setLName("");
      setSalary(0);
      setDateEmployeed(new Date().toISOString().slice(0, 10));
      setEmployeed(true);
      setUpdatedSalary(0);
      setUpdatedJobTitle("");
      setUpdatedId("");
      setUpdatedStartDate(new Date().toISOString().slice(0, 10));
      setJobTitle("");
      setSalaryId("");
      setMongoId("");
    }
  }, [
    dispatch,
    history,
    successEmployeeCreate,
    successEmployeeUpdate,
    userInfo,
  ]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createEmployee({
        first_name: fName,
        last_name: lName,
        employeed: true,
        id_number: id,
        salary: [
          {
            monthly_salary: salary,
            start_date: new Date(dateEmployeed).toISOString(),
            off_days_allotted: offDays,
            job_title: jobTitle,
          },
        ],
      })
    );
  };

  const submitUpdateHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateEmployee({
        first_name: fName,
        last_name: lName,
        salary: [
          {
            salary_id: salaryId,
            monthly_salary: isNaN(updatedSalary)
              ? parseInt(updatedSalary.replace(",", ""))
              : updatedSalary,
            start_date: new Date(updatedStartDate).toISOString(),
            end_date: updatedEndDate && updatedEndDate,
            job_title: updatedJobTitle,
          },
        ],
        employeed: employeed,
        id_number: updatedId,
        _id: mongoId,
      })
    );
  };

  const reactSelectList = employee.map((items, idx) => ({
    label: `${items.first_name} ${items.last_name}`,
    value: idx,
    id: items._id,
  }));

  useMemo(() => {
    if (mongoId) {
      let returnedValue = employee.find((x) => x._id === mongoId);

      if (returnedValue) {
        let index = returnedValue.salary.length - 1;
        console.log(returnedValue.salary[index]);

        setUpdatedId(() => returnedValue.id_number && returnedValue.id_number);
        setUpdatedJobTitle(() => returnedValue.salary[index].job_title);
        setUpdatedSalary(() => returnedValue.salary[index].monthly_salary);
        setSalaryId(() => returnedValue.salary[index]._id);
        setUpdatedStartDate(
          () =>
            returnedValue.salary[index].start_date &&
            returnedValue.salary[index].start_date.slice(0, 10)
        );
      }
    }
  }, [employee, mongoId]);

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Salaries</h1>
        </Col>
        <Button className='my-3' onClick={() => setShow(true)}>
          <i className='fas fa-plus'></i> ADD EMPLOYEE
        </Button>

        <Modal show={show} onHide={() => setShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Employee</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={submitHandler}>
              <Form.Group controlId='fname' style={{ padding: 10 }}>
                <Form.Label style={{ padding: 10 }}>First Name</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter First Name'
                  value={fName}
                  onChange={(e) => setFName(e.target.value)}></Form.Control>
              </Form.Group>

              <Form.Group controlId='lname' style={{ padding: 10 }}>
                <Form.Label style={{ padding: 10 }}>Last Name</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter Last Name'
                  value={lName}
                  onChange={(e) => setLName(e.target.value)}></Form.Control>
              </Form.Group>

              <Form.Group controlId='id' style={{ padding: 10 }}>
                <Form.Label style={{ padding: 10 }}>
                  Identification Number
                </Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter ID'
                  value={id}
                  onChange={(e) => setId(e.target.value)}></Form.Control>
              </Form.Group>

              <Form.Group controlId='jobtitle' style={{ padding: 10 }}>
                <Form.Label style={{ padding: 10 }}>Job Title</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter Job Title'
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}></Form.Control>
              </Form.Group>

              <Form.Group controlId='salary' style={{ padding: 10 }}>
                <Form.Label style={{ padding: 10 }}>Monthly Salary</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter Salary'
                  value={salary.toLocaleString()}
                  onChange={(e) => setSalary(e.target.value)}></Form.Control>
              </Form.Group>

              <Form.Group controlId='date_employeed' style={{ padding: 10 }}>
                <Form.Label style={{ padding: 10 }}>Date Employeed</Form.Label>
                <Form.Control
                  type='date'
                  placeholder='Enter Date Employeed'
                  value={dateEmployeed}
                  onChange={(e) =>
                    setDateEmployeed(e.target.value)
                  }></Form.Control>
              </Form.Group>

              <Form.Group controlId='off_days' style={{ padding: 10 }}>
                <Form.Label style={{ padding: 10 }}>
                  Off Days Assigned
                </Form.Label>
                <Form.Control
                  type='number'
                  placeholder='Enter Off Days'
                  value={offDays}
                  onChange={(e) => setOffDays(e.target.value)}
                  max={4}></Form.Control>
              </Form.Group>

              <Row style={{ margin: 15 }}>
                <Button
                  variant='primary'
                  type='submit'
                  onClick={() => setShow(false)}>
                  Save Changes
                </Button>
              </Row>
            </Form>
          </Modal.Body>
        </Modal>

        <Button className='my-3' onClick={() => setUpdateShow(true)}>
          <i className='fas fa-plus'></i> EDIT EMPLOYEE
        </Button>

        <Modal show={updateShow} onHide={() => setUpdateShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Employee</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={submitUpdateHandler}>
              <Form.Group controlId='name' style={{ padding: 10 }}>
                <Form.Label style={{ padding: 10 }}>Full Name</Form.Label>
                <Select
                  className='basic-single'
                  classNamePrefix='select'
                  isDisabled={false}
                  isLoading={!reactSelectList}
                  isClearable={false}
                  isRtl={false}
                  isSearchable={true}
                  name='names'
                  options={reactSelectList}
                  onChange={(e) => {
                    let firstName = e.label.split(" ")[0];
                    let lastName = e.label.split(" ")[1];

                    setMongoId(e.id);
                    setFName(firstName);
                    setLName(lastName);
                  }}
                />
              </Form.Group>

              <Form.Group controlId='id' style={{ padding: 10 }}>
                <Form.Label style={{ padding: 10 }}>
                  Identification Number
                </Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter Id'
                  value={updatedId && updatedId}
                  onChange={(e) => setUpdatedId(e.target.value)}></Form.Control>
              </Form.Group>

              <Form.Group controlId='jobtitle' style={{ padding: 10 }}>
                <Form.Label style={{ padding: 10 }}>Job Title</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter Job Title'
                  value={updatedJobTitle}
                  onChange={(e) =>
                    setUpdatedJobTitle(e.target.value)
                  }></Form.Control>
              </Form.Group>

              <Form.Group controlId='salary' style={{ padding: 10 }}>
                <Form.Label style={{ padding: 10 }}>Monthly Salary</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter Salary'
                  value={updatedSalary && updatedSalary.toLocaleString()}
                  onChange={(e) =>
                    setUpdatedSalary(e.target.value)
                  }></Form.Control>
              </Form.Group>

              <Form.Group controlId='start_date' style={{ padding: 10 }}>
                <Form.Label style={{ padding: 10 }}>Start Date</Form.Label>
                <Form.Control
                  type='date'
                  placeholder='Enter Date Employeed'
                  value={updatedStartDate}
                  onChange={(e) =>
                    setUpdatedStartDate(e.target.value)
                  }></Form.Control>
              </Form.Group>

              {employeed === false && (
                <Form.Group controlId='start_date' style={{ padding: 10 }}>
                  <Form.Label style={{ padding: 10 }}>End Date</Form.Label>
                  <Form.Control
                    type='date'
                    placeholder='Enter Date Fired'
                    value={updatedEndDate}
                    onChange={(e) =>
                      setUpdatedEndDate(e.target.value)
                    }></Form.Control>
                </Form.Group>
              )}

              <Form.Group controlId='date_employeed' style={{ padding: 10 }}>
                <Form.Label style={{ padding: 10 }}>Employeed</Form.Label>
                <div></div>

                <Form.Check
                  inline
                  label='Employeed'
                  name='group1'
                  type='radio'
                  id={`inline-2`}
                  defaultChecked
                  onChange={() => setEmployeed(true)}
                />

                <Form.Check
                  inline
                  label='Not Employeed'
                  name='group1'
                  type='radio'
                  id={`inline-2`}
                  onChange={() => setEmployeed(false)}
                />
              </Form.Group>

              <Row style={{ margin: 15 }}>
                <Button
                  variant='primary'
                  type='submit'
                  onClick={() => setUpdateShow(false)}>
                  Save Changes
                </Button>
              </Row>
            </Form>
          </Modal.Body>
        </Modal>
      </Row>

      {errorEmployeeCreate && (
        <Message variant='danger'>{errorEmployeeCreate}</Message>
      )}
      {!loadingEmployeeList && (
        <>
          <Table responsive bordered variant='light'>
            <thead>
              <tr></tr>
            </thead>
            {employee?.map((name, idx) => {
              return (
                <tbody style={{ backgroundColor: "white" }} key={idx}>
                  <tr style={{ backgroundColor: "white" }}>
                    <Accordion
                      style={{ width: "100%", backgroundColor: "white" }}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls='panel1c-content'
                        id='panel1c-header'
                        style={{ width: "100%", flex: 1 }}>
                        <td>
                          <React.Fragment>
                            <div className={classes.column}>
                              <Typography className={classes.heading}>
                                {name.first_name}
                              </Typography>
                            </div>
                          </React.Fragment>

                          <React.Fragment>
                            <div className={classes.column}>
                              <Typography className={classes.secondaryHeading}>
                                Monthly Salary - Rs.{" "}
                                {name.salary[0].monthly_salary}
                              </Typography>
                            </div>
                          </React.Fragment>
                        </td>
                      </AccordionSummary>

                      <AccordionDetails style={{ width: "100%" }}>
                        <Table
                          bordered
                          hover
                          variant='light'
                          style={{ width: "100%" }}>
                          <thead>
                            <tr>
                              <th>LAST UPDATED</th>
                              <th>TOTAL PAID</th>
                            </tr>
                          </thead>
                        </Table>
                      </AccordionDetails>
                    </Accordion>
                  </tr>
                </tbody>
              );
            })}
          </Table>
        </>
      )}
    </>
  );
};

export default SalaryListScreen;
