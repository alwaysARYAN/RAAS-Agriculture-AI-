import jsPDF from 'jspdf';
import 'jspdf-autotable';

class PDFExportService {
  // Helper to handle Unicode text
  static prepareText(text) {
    if (!text) return '';
    // Remove problematic characters but keep basic text
    return String(text).replace(/[^\x00-\x7F]/g, (char) => {
      // Keep common Unicode characters
      return char;
    });
  }

  // Export Farm Report
  static exportFarmReport(farms, userName) {
    const doc = new jsPDF();
    
    try {
      // Title
      doc.setFontSize(20);
      doc.setTextColor(34, 139, 34);
      doc.text('Farm Report', 14, 20);
      
      // User Info
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated for: ${userName || 'User'}`, 14, 30);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 35);
      
      // Summary
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text('Summary', 14, 45);
      doc.setFontSize(10);
      doc.text(`Total Farms: ${farms.length}`, 14, 52);
      const totalArea = farms.reduce((sum, f) => sum + (f.area || 0), 0);
      doc.text(`Total Area: ${totalArea.toFixed(2)} acres`, 14, 58);
      
      // Farms Table
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
        theme: 'striped',
        headStyles: { fillColor: [34, 139, 34] },
        margin: { top: 10 }
      });
      
      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
          `Page ${i} of ${pageCount} | Agriculture AI - Smart Farming System`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }
      
      doc.save(`Farm_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      return true;
    } catch (error) {
      console.error('PDF Export Error:', error);
      alert('Failed to export PDF. Please try again.');
      return false;
    }
  }

  // Export Crop Report
  static exportCropReport(crops, userName) {
    const doc = new jsPDF();
    
    try {
      doc.setFontSize(20);
      doc.setTextColor(34, 139, 34);
      doc.text('Crop Report', 14, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated for: ${userName || 'User'}`, 14, 30);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 35);
      
      // Summary
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text('Summary', 14, 45);
      doc.setFontSize(10);
      doc.text(`Total Crops: ${crops.length}`, 14, 52);
      
      const healthyCrops = crops.filter(c => c.health_status === 'Healthy').length;
      const criticalCrops = crops.filter(c => c.health_status === 'Critical').length;
      doc.text(`Healthy Crops: ${healthyCrops}`, 14, 58);
      doc.text(`Critical Crops: ${criticalCrops}`, 14, 64);
      
      // Crops Table
      const tableData = crops.map(crop => [
        crop.crop_name || 'N/A',
        crop.farm_id?.name || crop.farm_id?.farmName || 'N/A',
        crop.stage || 'N/A',
        crop.health_status || 'Unknown',
        crop.season || 'N/A',
        crop.planting_date ? new Date(crop.planting_date).toLocaleDateString() : 
          (crop.sowing_date ? new Date(crop.sowing_date).toLocaleDateString() : 'N/A')
      ]);
      
      doc.autoTable({
        startY: 72,
        head: [['Crop', 'Farm', 'Stage', 'Health', 'Season', 'Planted']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [34, 139, 34] },
        margin: { top: 10 },
        styles: { fontSize: 8 }
      });
      
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
          `Page ${i} of ${pageCount} | Agriculture AI - Smart Farming System`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }
      
      doc.save(`Crop_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      return true;
    } catch (error) {
      console.error('PDF Export Error:', error);
      alert('Failed to export PDF. Please try again.');
      return false;
    }
  }

  // Export Analytics Report
  static exportAnalyticsReport(analytics, userName) {
    const doc = new jsPDF();
    
    try {
      doc.setFontSize(20);
      doc.setTextColor(34, 139, 34);
      doc.text('Analytics Report', 14, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated for: ${userName || 'User'}`, 14, 30);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 35);
      
      const { overview, charts, recommendations } = analytics;
      
      // Overview Section
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text('Performance Overview', 14, 45);
      
      doc.setFontSize(10);
      let yPos = 52;
      doc.text(`Total Farms: ${overview.totalFarms || 0}`, 14, yPos);
      yPos += 6;
      doc.text(`Total Crops: ${overview.totalCrops || 0}`, 14, yPos);
      yPos += 6;
      doc.text(`Total Land: ${(overview.totalLand || 0).toFixed(2)} acres`, 14, yPos);
      yPos += 6;
      doc.text(`Disease Detections: ${overview.totalDiseaseDetections || 0}`, 14, yPos);
      yPos += 6;
      doc.text(`Productivity Score: ${overview.productivityScore || 0}/100`, 14, yPos);
      yPos += 6;
      doc.text(`Risk Level: ${overview.riskLevel || 'Unknown'}`, 14, yPos);
      yPos += 10;
      
      // Health Distribution
      doc.setFontSize(14);
      doc.text('Crop Health Distribution', 14, yPos);
      yPos += 7;
      doc.setFontSize(10);
      
      if (charts && charts.healthDistribution) {
        Object.entries(charts.healthDistribution).forEach(([status, count]) => {
          doc.text(`${status}: ${count} crops`, 20, yPos);
          yPos += 6;
        });
      }
      
      yPos += 5;
      
      // Recommendations
      if (recommendations && recommendations.length > 0) {
        doc.setFontSize(14);
        doc.text('Recommendations', 14, yPos);
        yPos += 7;
        doc.setFontSize(9);
        
        recommendations.slice(0, 5).forEach((rec, index) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(`${index + 1}. ${rec.title || 'Recommendation'}`, 20, yPos);
          yPos += 5;
          const lines = doc.splitTextToSize(rec.message || '', 170);
          doc.text(lines, 23, yPos);
          yPos += (lines.length * 5) + 3;
        });
      }
      
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
          `Page ${i} of ${pageCount} | Agriculture AI - Smart Farming System`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }
      
      doc.save(`Analytics_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      return true;
    } catch (error) {
      console.error('PDF Export Error:', error);
      alert('Failed to export PDF. Please try again.');
      return false;
    }
  }

  // Export Disease Detection Report
  static exportDiseaseReport(detections, userName) {
    const doc = new jsPDF();
    
    try {
      doc.setFontSize(20);
      doc.setTextColor(34, 139, 34);
      doc.text('Disease Detection Report', 14, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated for: ${userName || 'User'}`, 14, 30);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 35);
      
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text('Summary', 14, 45);
      doc.setFontSize(10);
      doc.text(`Total Detections: ${detections.length}`, 14, 52);
      
      const tableData = detections.map(d => [
        d.disease_name || 'Unknown',
        d.crop_id?.crop_name || 'Unknown',
        `${d.confidence || 0}%`,
        d.severity || 'N/A',
        d.createdAt ? new Date(d.createdAt).toLocaleDateString() : 'N/A'
      ]);
      
      doc.autoTable({
        startY: 60,
        head: [['Disease', 'Crop', 'Confidence', 'Severity', 'Date']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [34, 139, 34] },
        margin: { top: 10 }
      });
      
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
          `Page ${i} of ${pageCount} | Agriculture AI - Smart Farming System`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }
      
      doc.save(`Disease_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      return true;
    } catch (error) {
      console.error('PDF Export Error:', error);
      alert('Failed to export PDF. Please try again.');
      return false;
    }
  }
}

export default PDFExportService;
