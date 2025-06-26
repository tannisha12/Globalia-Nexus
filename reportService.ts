import { jsPDF } from 'jspdf';

export interface ReportData {
  region: string;
  category: string;
  timeframe: string;
  economicData: any[];
  globalIndicators: any[];
  economicRisks: any[];
  sectorPerformance: any[];
  tradeFlows: any[];
}

export interface ReportOptions {
  includeCharts: boolean;
  includeRiskAssessment: boolean;
  includeRecommendations: boolean;
  format: 'pdf' | 'json' | 'csv';
}

export class ReportGenerator {
  private doc: jsPDF;
  private pageHeight: number = 297; // A4 height in mm
  private pageWidth: number = 210; // A4 width in mm
  private margin: number = 20;
  private currentY: number = 20;

  constructor() {
    this.doc = new jsPDF();
  }

  private addHeader(title: string) {
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.margin, this.currentY);
    this.currentY += 15;

    // Add date and time
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    const now = new Date();
    this.doc.text(`Generated: ${now.toLocaleString()}`, this.margin, this.currentY);
    this.currentY += 10;

    // Add separator line
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
    this.currentY += 10;
  }

  private addSection(title: string, content: string) {
    this.checkPageBreak(30);
    
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.margin, this.currentY);
    this.currentY += 10;

    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    
    // Split content into lines that fit the page width
    const lines = this.doc.splitTextToSize(content, this.pageWidth - 2 * this.margin);
    
    for (const line of lines) {
      this.checkPageBreak(5);
      this.doc.text(line, this.margin, this.currentY);
      this.currentY += 5;
    }
    
    this.currentY += 5;
  }

  private addTable(headers: string[], rows: string[][]) {
    this.checkPageBreak(50);
    
    const colWidth = (this.pageWidth - 2 * this.margin) / headers.length;
    
    // Draw headers
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'bold');
    
    headers.forEach((header, index) => {
      this.doc.text(header, this.margin + index * colWidth, this.currentY);
    });
    
    this.currentY += 7;
    
    // Draw separator line
    this.doc.setLineWidth(0.3);
    this.doc.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
    this.currentY += 5;
    
    // Draw rows
    this.doc.setFont('helvetica', 'normal');
    
    rows.forEach(row => {
      this.checkPageBreak(7);
      
      row.forEach((cell, index) => {
        const cellText = this.doc.splitTextToSize(cell, colWidth - 5);
        this.doc.text(cellText[0] || '', this.margin + index * colWidth, this.currentY);
      });
      
      this.currentY += 7;
    });
    
    this.currentY += 5;
  }

  private addKeyMetrics(metrics: { [key: string]: string }) {
    this.checkPageBreak(30);
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Key Metrics', this.margin, this.currentY);
    this.currentY += 10;

    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    
    Object.entries(metrics).forEach(([key, value]) => {
      this.checkPageBreak(6);
      this.doc.text(`${key}: ${value}`, this.margin + 5, this.currentY);
      this.currentY += 6;
    });
    
    this.currentY += 5;
  }

  private addRiskAssessment(risks: any[]) {
    this.checkPageBreak(40);
    
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Risk Assessment', this.margin, this.currentY);
    this.currentY += 15;

    risks.forEach(risk => {
      this.checkPageBreak(25);
      
      this.doc.setFontSize(11);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(risk.risk, this.margin, this.currentY);
      this.currentY += 7;
      
      this.doc.setFontSize(9);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(`Probability: ${risk.probability} | Impact: ${risk.impact}`, this.margin + 5, this.currentY);
      this.currentY += 5;
      
      const descLines = this.doc.splitTextToSize(risk.description, this.pageWidth - 2 * this.margin - 10);
      descLines.forEach((line: string) => {
        this.checkPageBreak(5);
        this.doc.text(line, this.margin + 5, this.currentY);
        this.currentY += 5;
      });
      
      this.currentY += 3;
    });
  }

  private addExecutiveSummary(data: ReportData) {
    const criticalRisks = data.economicRisks.filter(r => r.impact === 'Critical').length;
    const highRisks = data.economicRisks.filter(r => r.impact === 'High').length;
    
    const summary = `
This economic intelligence report provides comprehensive analysis of global economic conditions as of ${new Date().toLocaleDateString()}.

KEY FINDINGS:
• ${criticalRisks} critical economic risks identified requiring immediate attention
• ${highRisks} high-impact risks monitored across multiple regions
• Global economic growth remains subdued with significant regional variations
• Trade tensions and supply chain disruptions continue to impact global commerce
• Energy security concerns persist, particularly in Europe and Asia

REGIONAL FOCUS: ${data.region === 'global' ? 'Global overview with emphasis on major economic powers' : data.region}
ANALYSIS PERIOD: ${data.timeframe} assessment with forward-looking projections
RISK LEVEL: Elevated across multiple dimensions requiring strategic planning

This report synthesizes intelligence from multiple sources including central bank data, trade statistics, geopolitical analysis, and market indicators to provide actionable insights for decision-makers.
    `;

    this.addSection('Executive Summary', summary.trim());
  }

  private addRecommendations(data: ReportData) {
    const recommendations = `
STRATEGIC RECOMMENDATIONS:

1. RISK MITIGATION
   • Diversify supply chains away from single-source dependencies
   • Establish strategic reserves for critical commodities
   • Implement robust currency hedging strategies
   • Develop contingency plans for major trade route disruptions

2. INVESTMENT STRATEGY
   • Focus on resilient sectors: technology, healthcare, renewable energy
   • Avoid overexposure to vulnerable regions and currencies
   • Consider defensive positioning in uncertain markets
   • Maintain liquidity for opportunistic investments

3. OPERATIONAL ADJUSTMENTS
   • Accelerate digital transformation initiatives
   • Strengthen local supplier networks
   • Enhance cybersecurity and data protection measures
   • Develop flexible workforce strategies

4. MONITORING PRIORITIES
   • Track central bank policy changes in major economies
   • Monitor geopolitical developments affecting trade routes
   • Watch for early warning signs of debt crises in emerging markets
   • Assess climate-related economic impacts

5. SCENARIO PLANNING
   • Prepare for potential recession in major economies
   • Plan for continued supply chain volatility
   • Consider impacts of further trade fragmentation
   • Develop strategies for energy transition costs

These recommendations should be adapted to specific organizational contexts and risk tolerances.
    `;

    this.addSection('Strategic Recommendations', recommendations.trim());
  }

  private checkPageBreak(requiredSpace: number) {
    if (this.currentY + requiredSpace > this.pageHeight - this.margin) {
      this.doc.addPage();
      this.currentY = this.margin;
    }
  }

  private addFooter() {
    const pageCount = this.doc.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.setFontSize(8);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(
        `GeoPolitics AI Economic Intelligence Report - Page ${i} of ${pageCount}`,
        this.margin,
        this.pageHeight - 10
      );
      this.doc.text(
        'CONFIDENTIAL - For Internal Use Only',
        this.pageWidth - this.margin - 50,
        this.pageHeight - 10
      );
    }
  }

  public generatePDFReport(data: ReportData, options: ReportOptions): Blob {
    // Reset document
    this.doc = new jsPDF();
    this.currentY = 20;

    // Add header
    this.addHeader('Economic Intelligence Report');

    // Add executive summary
    this.addExecutiveSummary(data);

    // Add global indicators
    if (data.globalIndicators.length > 0) {
      this.addSection('Global Economic Indicators', 
        'Current global economic indicators show mixed signals with persistent challenges across multiple dimensions.'
      );
      
      const indicatorRows = data.globalIndicators.map(indicator => [
        indicator.name,
        indicator.value,
        indicator.change,
        indicator.description
      ]);
      
      this.addTable(
        ['Indicator', 'Value', 'Change', 'Description'],
        indicatorRows
      );
    }

    // Add detailed analysis for each economic data point
    data.economicData.forEach(item => {
      this.addSection(item.title, item.summary);
      this.addKeyMetrics(item.keyMetrics);
      
      if (item.implications && item.implications.length > 0) {
        const implicationsText = item.implications.join('\n• ');
        this.addSection('Key Implications', '• ' + implicationsText);
      }
    });

    // Add risk assessment if requested
    if (options.includeRiskAssessment && data.economicRisks.length > 0) {
      this.addRiskAssessment(data.economicRisks);
    }

    // Add sector performance
    if (data.sectorPerformance.length > 0) {
      const sectorRows = data.sectorPerformance.map(sector => [
        sector.sector,
        sector.performance,
        sector.status
      ]);
      
      this.addSection('Sector Performance Analysis', 
        'Performance across key economic sectors shows significant variation with technology and energy leading while traditional manufacturing faces headwinds.'
      );
      
      this.addTable(
        ['Sector', 'Performance', 'Status'],
        sectorRows
      );
    }

    // Add trade flows
    if (data.tradeFlows.length > 0) {
      const tradeRows = data.tradeFlows.map(flow => [
        flow.route,
        flow.volume,
        flow.change,
        flow.status
      ]);
      
      this.addSection('Global Trade Flow Analysis', 
        'International trade patterns show significant disruption with traditional routes under pressure while new corridors emerge.'
      );
      
      this.addTable(
        ['Trade Route', 'Volume', 'Change', 'Status'],
        tradeRows
      );
    }

    // Add recommendations if requested
    if (options.includeRecommendations) {
      this.addRecommendations(data);
    }

    // Add methodology section
    this.addSection('Methodology', 
      `This report synthesizes data from multiple authoritative sources including central banks, international organizations, market data providers, and geopolitical intelligence services. Analysis covers the ${data.timeframe} period with focus on ${data.region === 'global' ? 'global trends' : data.region}. Risk assessments use standardized probability and impact matrices. All data is current as of report generation date.`
    );

    // Add footer
    this.addFooter();

    // Return PDF as blob
    return this.doc.output('blob');
  }

  public generateJSONReport(data: ReportData): string {
    const report = {
      metadata: {
        title: 'Economic Intelligence Report',
        generatedAt: new Date().toISOString(),
        region: data.region,
        category: data.category,
        timeframe: data.timeframe,
        version: '1.0'
      },
      executiveSummary: {
        criticalRisks: data.economicRisks.filter(r => r.impact === 'Critical').length,
        highRisks: data.economicRisks.filter(r => r.impact === 'High').length,
        totalAnalyses: data.economicData.length
      },
      globalIndicators: data.globalIndicators,
      economicAnalyses: data.economicData,
      riskAssessment: data.economicRisks,
      sectorPerformance: data.sectorPerformance,
      tradeFlows: data.tradeFlows,
      recommendations: [
        'Diversify supply chains away from single-source dependencies',
        'Focus on resilient sectors: technology, healthcare, renewable energy',
        'Monitor central bank policy changes in major economies',
        'Prepare for potential recession scenarios'
      ]
    };

    return JSON.stringify(report, null, 2);
  }

  public generateCSVReport(data: ReportData): string {
    let csv = 'Report Type,Economic Intelligence Report\n';
    csv += `Generated At,${new Date().toISOString()}\n`;
    csv += `Region,${data.region}\n`;
    csv += `Category,${data.category}\n`;
    csv += `Timeframe,${data.timeframe}\n\n`;

    // Global Indicators
    csv += 'Global Economic Indicators\n';
    csv += 'Indicator,Value,Change,Description\n';
    data.globalIndicators.forEach(indicator => {
      csv += `"${indicator.name}","${indicator.value}","${indicator.change}","${indicator.description}"\n`;
    });
    csv += '\n';

    // Economic Analyses
    csv += 'Economic Analyses\n';
    csv += 'Title,Region,Type,Impact,Trend,Summary\n';
    data.economicData.forEach(item => {
      csv += `"${item.title}","${item.region}","${item.type}","${item.impact}","${item.trend}","${item.summary}"\n`;
    });
    csv += '\n';

    // Risk Assessment
    csv += 'Risk Assessment\n';
    csv += 'Risk,Probability,Impact,Description\n';
    data.economicRisks.forEach(risk => {
      csv += `"${risk.risk}","${risk.probability}","${risk.impact}","${risk.description}"\n`;
    });

    return csv;
  }
}

export const downloadReport = (blob: Blob, filename: string, format: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.${format}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};