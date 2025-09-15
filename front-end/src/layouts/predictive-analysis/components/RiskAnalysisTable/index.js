/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Icon from "@mui/material/Icon";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

function RiskAnalysisTable({ data }) {
  const getRiskColor = (probability) => {
    if (probability >= 80) return "error";
    if (probability >= 60) return "warning";
    if (probability >= 40) return "info";
    return "success";
  };

  const getRiskLabel = (probability) => {
    if (probability >= 80) return "Critical";
    if (probability >= 60) return "High";
    if (probability >= 40) return "Medium";
    return "Low";
  };

  const handleMitigateRisk = (riskId) => {
    // TODO: Connect to risk mitigation API here
    console.log("Mitigating risk:", riskId);
  };

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
      <CardContent sx={{ p: 0 }}>
        {/* Header */}
        <MDBox
          p={3}
          sx={{
            borderBottom: "1px solid",
            borderColor: "grey.200",
            background: "linear-gradient(135deg, #1976d2 0%, #1976d2 100%)",
            color: "white",
            borderRadius: "12px 12px 0 0",
          }}
        >
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDBox>
              <MDTypography variant="h6" fontWeight="bold" color="white" mb={0.5}>
                Top Predicted Risks
              </MDTypography>
              <MDTypography variant="body2" color="white" sx={{ opacity: 0.9 }}>
                AI-identified risks with probability scores
              </MDTypography>
            </MDBox>
            <Box display="flex" alignItems="center" gap={1}>
              <Icon sx={{ color: "white" }}>warning</Icon>
              <MDTypography variant="body2" color="white" fontWeight="medium">
                {data.length} Risks Identified
              </MDTypography>
            </Box>
          </MDBox>
        </MDBox>

        {/* Table */}
        <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
          <Table sx={{ minWidth: 650 }} aria-label="risk analysis table">
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.50" }}>
                <TableCell sx={{ fontWeight: "bold", px: 3, py: 2 }}>Risk Type</TableCell>
                <TableCell sx={{ fontWeight: "bold", px: 3, py: 2 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: "bold", px: 3, py: 2 }} align="center">
                  Probability
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", px: 3, py: 2 }} align="center">
                  Impact
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", px: 3, py: 2 }} align="center">
                  Timeframe
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", px: 3, py: 2 }} align="center">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((risk, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": { bgcolor: "grey.50" },
                  }}
                >
                  <TableCell component="th" scope="row" sx={{ px: 3, py: 2 }}>
                    <MDBox display="flex" alignItems="center" gap={1}>
                      <Icon
                        sx={{
                          color: `${getRiskColor(risk.probability)}.main`,
                          fontSize: 20,
                        }}
                      >
                        {risk.icon}
                      </Icon>
                      <MDTypography variant="body2" fontWeight="medium">
                        {risk.type}
                      </MDTypography>
                    </MDBox>
                  </TableCell>
                  <TableCell sx={{ px: 3, py: 2 }}>
                    <MDTypography variant="body2" color="text">
                      {risk.description}
                    </MDTypography>
                  </TableCell>
                  <TableCell align="center" sx={{ px: 3, py: 2 }}>
                    <Chip
                      label={`${risk.probability}%`}
                      color={getRiskColor(risk.probability)}
                      size="small"
                      sx={{ fontWeight: "bold" }}
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ px: 3, py: 2 }}>
                    <Chip
                      label={risk.impact}
                      color={
                        risk.impact === "High"
                          ? "error"
                          : risk.impact === "Medium"
                          ? "warning"
                          : "success"
                      }
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ px: 3, py: 2 }}>
                    <MDTypography variant="body2" color="text">
                      {risk.timeframe}
                    </MDTypography>
                  </TableCell>
                  <TableCell align="center" sx={{ px: 3, py: 2 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={() => handleMitigateRisk(risk.id)}
                      sx={{
                        minWidth: "auto",
                        px: 1,
                        color: "black !important",
                        borderColor: "primary.main",
                        "&:hover": {
                          borderColor: "primary.dark",
                          backgroundColor: "primary.light",
                          color: "black !important",
                        },
                      }}
                    >
                      Mitigate
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Footer */}
        <MDBox
          p={2}
          sx={{
            borderTop: "1px solid",
            borderColor: "grey.200",
            bgcolor: "grey.50",
            borderRadius: "0 0 12px 12px",
          }}
        >
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDBox display="flex" alignItems="center" gap={1}>
              <Icon sx={{ fontSize: 16, color: "text.secondary" }}>info</Icon>
              <MDTypography variant="caption" color="text">
                Risks are automatically updated every 30 minutes
              </MDTypography>
            </MDBox>
            <Button
              size="small"
              variant="contained"
              color="primary"
              sx={{
                color: "white !important",
                fontWeight: "medium",
                "&:hover": {
                  color: "white !important",
                },
              }}
            >
              View All Risks
            </Button>
          </MDBox>
        </MDBox>
      </CardContent>
    </Card>
  );
}

// Setting default values for the props of RiskAnalysisTable
RiskAnalysisTable.defaultProps = {
  data: [],
};

// Typechecking props for the RiskAnalysisTable
RiskAnalysisTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      probability: PropTypes.number.isRequired,
      impact: PropTypes.string.isRequired,
      timeframe: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
    })
  ),
};

export default RiskAnalysisTable;
