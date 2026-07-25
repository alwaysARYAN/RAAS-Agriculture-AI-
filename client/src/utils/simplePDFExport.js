// Simple PDF Export without external library
// Falls back to CSV if jsPDF fails

class SimplePDFExport {
  static exportFarmReport(farms, userName) {
    try {
      // Try to use jsPDF
      const jsPDF = require('jspdf');
      require('jspdf-autotable');
      
      const doc = new jsPDF.default();
      
      // Title
      doc.setFontSize(20);
      doc.text('Farm Report', 14, 20);
      
      // User Info
      doc.setFontSize(10);
      doc.text(`Generated for: ${userName || 'User'}`, 14, 30);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 35);
      
      // Summary
      doc.setFontSize(14);
      doc.text('Summary', 14, 45);
      doc.setFontSize(10);
      doc.text(`Total Farms: ${farms.length}`, 14, 52);
      const totalArea = farms.reduce((sum, f) => sum + (f.area || 0), 0);
      doc.text(`Total Area: ${totalArea.toFixed(2)} acres`, 14, 58);
      
      // Table Data
      const tableData = farms.map(farm => [
        farm.name || farm.farmName || 'N/A',
        `${farm.location?.state || ''} ${farm.location?.district || ''}`.trim() || 'N/A',
        `${farm.area || 0} acres`,
        farm.soil_type || 'N/A',
        farm.irrigation_type || farm.irrigation_method || 'N/A'
      ]);
      
      doc.autoTable({
        startY: 65,
        head: [['Farm Name', 'Location', 'Area', 'Soil Type', 'Irrigation']],
        body: tableData,
        theme: 'striped'
      });
      
      doc.save(`Farm_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      return true;
    } catch (error) {
      console.error('PDF generation failed, falling back to CSV:', error);
      // Fallback to CSV export
      return this.exportFarmCSV(farms, userName);
    }
  }

  static exportFarmCSV(farms, userName) {
    try {
      let csv = 'Farm Report\n';
      csv += `Generated for: ${userName || 'User'}\n`;
      csv += `Date: ${new Date().toLocaleDateString()}\n\n`;
      csv += 'Farm Name,Location,Area (acres),Soil Type,Irrigation\n';
      
      farms.forEach(farm => {
        const location = `${farm.location?.state || ''} ${farm.location?.district || ''}`.trim();
        csv += `"${farm.name || farm.farmName || 'N/A'}","${location}","${farm.area || 0}","${farm.soil_type || 'N/A'}","${farm.irrigation_type || farm.irrigation_method || 'N/A'}"\n`;
      });
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Farm_Report_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      alert('Exported as CSV file (PDF library not available)');
      return true;
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export. Error: ' + error.message);
      return false;
    }
  }

  static exportCropReport(crops, userName) {
    try {
      const jsPDF = require('jspdf');
      require('jspdf-autotable');
      
      const doc = new jsPDF.default();
      
      doc.setFontSize(20);
      doc.text('Crop Report', 14, 20);
      
      doc.setFontSize(10);
      doc.text(`Generated for: ${userName || 'User'}`, 14, 30);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 35);
      
      doc.setFontSize(14);
      doc.text('Summary', 14, 45);
      doc.setFontSize(10);
      doc.text(`Total Crops: ${crops.length}`, 14, 52);
      
      const tableData = crops.map(crop => [
        crop.crop_name || 'N/A',
        crop.farm_id?.name || crop.farm_id?.farmName || 'N/A',
        crop.stage || 'N/A',
        crop.health_status || 'Unknown',
        crop.season || 'N/A'
      ]);
      
      doc.autoTable({
        startY: 60,
        head: [['Crop', 'Farm', 'Stage', 'Health', 'Season']],
        body: tableData,
        theme: 'striped'
      });
      
      doc.save(`Crop_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      return true;
    } catch (error) {
      console.error('PDF generation failed:', error);
      return this.exportCropCSV(crops, userName);
    }
  }

  static exportCropCSV(crops, userName) {
    try {
      let csv = 'Crop Report\n';
      csv += `Generated for: ${userName || 'User'}\n`;
      csv += `Date: ${new Date().toLocaleDateString()}\n\n`;
      csv += 'Crop Name,Farm,Stage,Health,Season\n';
      
      crops.forEach(crop => {
        csv += `"${crop.crop_name || 'N/A'}","${crop.farm_id?.name || crop.farm_id?.farmName || 'N/A'}","${crop.stage || 'N/A'}","${crop.health_status || 'Unknown'}","${crop.season || 'N/A'}"\n`;
      });
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Crop_Report_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      alert('Exported as CSV file (PDF library not available)');
      return true;
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export. Error: ' + error.message);
      return false;
    }
  }

  static exportAnalyticsReport(analytics, userName) {
    try {
      const jsPDF = require('jspdf');
      const doc = new jsPDF.default();
      
      doc.setFontSize(20);
      doc.text('Analytics Report', 14, 20);
      
      doc.setFontSize(10);
      doc.text(`Generated for: ${userName || 'User'}`, 14, 30);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 35);
      
      const { overview } = analytics;
      
      doc.setFontSize(14);
      doc.text('Performance Overview', 14, 45);
      
      doc.setFontSize(10);
      let y = 52;
      doc.text(`Total Farms: ${overview.totalFarms || 0}`, 14, y); y += 6;
      doc.text(`Total Crops: ${overview.totalCrops || 0}`, 14, y); y += 6;
      doc.text(`Total Land: ${(overview.totalLand || 0).toFixed(2)} acres`, 14, y); y += 6;
      doc.text(`Productivity Score: ${overview.productivityScore || 0}/100`, 14, y); y += 6;
      doc.text(`Risk Level: ${overview.riskLevel || 'Unknown'}`, 14, y);
      
      doc.save(`Analytics_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      return true;
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to export analytics. Error: ' + error.message);
      return false;
    }
  }
}

export default SimplePDFExport;
