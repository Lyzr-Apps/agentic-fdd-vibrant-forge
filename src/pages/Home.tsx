import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { callAIAgent } from '@/utils/aiAgent'
import type { NormalizedAgentResponse } from '@/utils/aiAgent'
import {
  Plus, Upload, FileText, CheckCircle, AlertTriangle, XCircle,
  TrendingUp, TrendingDown, Calendar, DollarSign, Flag,
  Building, Users, Clock, Download, ArrowRight, RefreshCw,
  BarChart, Filter, Search, Home as HomeIcon, Loader2
} from 'lucide-react'

// Agent IDs
const AGENT_IDS = {
  FDD_COORDINATOR: '6970c7d71d92f5e2dd22a543',
  DATA_EXTRACTION: '6970c7631d92f5e2dd22a517',
  RECONCILIATION: '6970c777d6d0dcaec1117e73',
  QOE_ANALYSIS: '6970c7921d92f5e2dd22a527',
  NWC_ANALYSIS: '6970c7b51d92f5e2dd22a537',
  INTERVIEW_PREP: '6970c7fad6d0dcaec1117eaf',
  REPORT_GENERATION: '6970c82a1d92f5e2dd22a552'
}

// TypeScript Interfaces from test responses
interface SubAgentResults {
  data_extraction: string
  reconciliation: string
  qoe_analysis: string
  nwc_analysis: string
}

interface CrossFunctionalRisk {
  risk_type: string
  description: string
  affected_areas: string[]
  severity: string
  recommended_action: string
}

interface AggregatedFindings {
  total_red_flags: number
  critical_issues: number
  high_priority_issues: number
  cross_functional_risks: CrossFunctionalRisk[]
}

interface ExecutiveSummary {
  overall_risk_rating: string
  key_findings: string[]
  deal_breakers: string[]
  negotiation_points: string[]
}

interface FDDCoordinatorResult {
  workflow_status: string
  sub_agent_results: SubAgentResults
  aggregated_findings: AggregatedFindings
  executive_summary: ExecutiveSummary
  next_steps: string[]
}

interface Discrepancy {
  account_code: string
  account_name: string
  trial_balance: number
  audited_statement: number
  variance: number
  variance_percentage: number
  severity: string
  explanation: string
}

interface ReconciliationSummary {
  critical_issues: number
  high_issues: number
  medium_issues: number
  low_issues: number
  total_variance_amount: number
}

interface ReconciliationResult {
  reconciliation_status: string
  total_accounts_compared: number
  discrepancies_found: number
  discrepancies: Discrepancy[]
  summary: ReconciliationSummary
  recommendations: string[]
}

interface AddbackCategory {
  category: string
  description: string
  amount: number
  rationale: string
  defensibility: string
  supporting_evidence: string
}

interface EBITDABridge {
  reported_ebitda: number
  personal_expenses: number
  one_time_fees: number
  litigation_costs: number
  owner_compensation_adj: number
  other_adjustments: number
  normalized_ebitda: number
}

interface QualityAssessment {
  revenue_quality_score: number
  expense_quality_score: number
  overall_earnings_quality: string
  red_flags: string[]
}

interface QoEResult {
  reported_ebitda: number
  total_addbacks: number
  normalized_ebitda: number
  addback_categories: AddbackCategory[]
  ebitda_bridge: EBITDABridge
  quality_assessment: QualityAssessment
  recommendations: string[]
}

interface NWCCalculation {
  current_assets: number
  current_liabilities: number
  cash_excluded: number
  debt_excluded: number
  net_working_capital: number
  nwc_as_percent_revenue: number
}

interface TrendAnalysis {
  periods: string[]
  nwc_values: (number | null)[]
  trend_direction: string
}

interface Anomaly {
  type: string
  description: string
  impact_amount: number
  severity: string
  evidence: string
}

interface NormalizationAdjustment {
  description: string
  amount: number
}

interface RecommendedNWCTarget {
  proposed_target: number
  adjustment_rationale: string
  normalization_adjustments: NormalizationAdjustment[]
}

interface NWCResult {
  nwc_calculation: NWCCalculation
  trend_analysis: TrendAnalysis
  anomalies_detected: Anomaly[]
  cash_conversion_cycle: {
    days_sales_outstanding: number | null
    days_inventory_outstanding: number | null
    days_payables_outstanding: number | null
    cash_conversion_days: number | null
  }
  recommended_nwc_target: RecommendedNWCTarget
  red_flags: string[]
  recommendations: string[]
}

interface InterviewQuestion {
  question: string
  rationale: string
  validation_framework: string
  data_requests: string[]
  follow_up_questions: string[]
}

interface QuestionSet {
  category: string
  related_anomaly: string
  severity: string
  questions: InterviewQuestion[]
}

interface ValidationChecklistItem {
  claim_to_verify: string
  required_documentation: string[]
  acceptance_criteria: string
}

interface InterviewPrepResult {
  interview_prep_summary: {
    total_questions_generated: number
    focus_areas: string[]
    priority_topics: string[]
  }
  question_sets: QuestionSet[]
  validation_checklist: ValidationChecklistItem[]
  recommended_attendees: string[]
  interview_duration_estimate: string
}

interface ReportMetadata {
  report_id: string
  company_name: string
  report_date: string
  report_type: string
}

interface ReportExecutiveSummary {
  overall_risk_rating: string
  investment_recommendation: string
  key_highlights: string[]
  critical_issues: string[]
  value_drivers: string[]
}

interface EBITDAAdjustment {
  category: string
  amount: number
  defensibility: string
}

interface ReportEBITDABridge {
  reported_ebitda: number
  adjustments: EBITDAAdjustment[]
  normalized_ebitda: number
  ebitda_multiple_impact: number
}

interface SPANegotiationPoint {
  topic: string
  recommendation: string
  financial_impact: number
  priority: string
}

interface ReportResult {
  report_metadata: ReportMetadata
  executive_summary: ReportExecutiveSummary
  ebitda_bridge: ReportEBITDABridge
  qoe_summary: {
    total_addbacks: number
    addback_categories: EBITDAAdjustment[]
    quality_assessment: string
  }
  nwc_summary: {
    current_nwc: number
    recommended_target: number
    adjustment_impact: number
    manipulation_flags: string[]
  }
  red_flags: {
    critical: string[]
    high: string[]
    medium: string[]
  }
  spa_negotiation_points: SPANegotiationPoint[]
  price_adjustments: {
    recommended_valuation_discount: number
    nwc_peg_adjustment: number
    total_impact: number
    rationale: string
  }
  next_steps: string[]
}

// Mock deals for dashboard
const mockDeals = [
  { id: 1, company: 'ABC Manufacturing', industry: 'Industrial', phase: 'Data Room', daysRemaining: 14, ebitda: 5.2, flags: 3 },
  { id: 2, company: 'TechCo Solutions', industry: 'SaaS', phase: 'Findings Review', daysRemaining: 7, ebitda: 8.5, flags: 1 },
  { id: 3, company: 'RetailMax Inc', industry: 'Retail', phase: 'Interview Prep', daysRemaining: 21, ebitda: 3.8, flags: 5 }
]

type Screen = 'dashboard' | 'setup' | 'dataroom' | 'findings' | 'interview' | 'report'

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount)
}

// Get severity badge color
const getSeverityColor = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'critical': return 'bg-red-500 text-white'
    case 'high': return 'bg-amber-500 text-white'
    case 'medium': return 'bg-yellow-500 text-gray-900'
    case 'low': return 'bg-green-500 text-white'
    default: return 'bg-gray-500 text-white'
  }
}

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard')
  const [loading, setLoading] = useState(false)

  // Engagement setup state
  const [engagementData, setEngagementData] = useState({
    companyName: '',
    industry: '',
    closeDate: '',
    dealValue: '',
    teamLead: '',
    analyst: ''
  })

  // Data room state
  const [vdrProvider, setVdrProvider] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'processing' | 'complete'>('idle')

  // Agent responses
  const [fddResponse, setFddResponse] = useState<FDDCoordinatorResult | null>(null)
  const [reconciliationResponse, setReconciliationResponse] = useState<ReconciliationResult | null>(null)
  const [qoeResponse, setQoeResponse] = useState<QoEResult | null>(null)
  const [nwcResponse, setNwcResponse] = useState<NWCResult | null>(null)
  const [interviewResponse, setInterviewResponse] = useState<InterviewPrepResult | null>(null)
  const [reportResponse, setReportResponse] = useState<ReportResult | null>(null)

  // Interview prep state
  const [interviewNotes, setInterviewNotes] = useState<{ [key: string]: string }>({})

  const handleProcessDataRoom = async () => {
    setLoading(true)
    setProcessingStatus('processing')

    try {
      const message = `Analyze the uploaded VDR files for ${engagementData.companyName}. The data room includes Trial Balance for FY2024, audited financials, payroll registers, and inventory aging reports.`

      const result = await callAIAgent(message, AGENT_IDS.FDD_COORDINATOR)

      if (result.success && result.response.status === 'success') {
        setFddResponse(result.response.result as FDDCoordinatorResult)
        setProcessingStatus('complete')
        setCurrentScreen('findings')
      }
    } catch (error) {
      console.error('Error processing data room:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateInterviewPrep = async () => {
    setLoading(true)

    try {
      // Build message from FDD findings
      const anomalies = fddResponse
        ? `Based on FDD analysis for ${engagementData.companyName}:

        Key Findings: ${fddResponse.executive_summary.key_findings.join('; ')}

        Deal Breakers: ${fddResponse.executive_summary.deal_breakers.join('; ')}

        Cross-Functional Risks: ${fddResponse.aggregated_findings.cross_functional_risks.map(r => `${r.risk_type} (${r.severity}): ${r.description}`).join('; ')}

        Critical Issues: ${fddResponse.aggregated_findings.critical_issues}
        High Priority Issues: ${fddResponse.aggregated_findings.high_priority_issues}

        Generate targeted management interview questions based on these findings.`
        : 'Generate management interview questions based on these anomalies: 45% AR spike in Q4, payables stretched from 30 to 60 days, inventory turnover decline.'

      const result = await callAIAgent(anomalies, AGENT_IDS.INTERVIEW_PREP)

      if (result.success && result.response.status === 'success') {
        setInterviewResponse(result.response.result as InterviewPrepResult)
        setCurrentScreen('interview')
      }
    } catch (error) {
      console.error('Error generating interview prep:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateReport = async () => {
    setLoading(true)

    try {
      // Build comprehensive report message from all findings
      const reportInput = fddResponse
        ? `Generate comprehensive FDD report for ${engagementData.companyName}.

        EXECUTIVE SUMMARY:
        - Overall Risk Rating: ${fddResponse.executive_summary.overall_risk_rating}
        - Key Findings: ${fddResponse.executive_summary.key_findings.join('; ')}
        - Deal Breakers: ${fddResponse.executive_summary.deal_breakers.join('; ')}
        - Negotiation Points: ${fddResponse.executive_summary.negotiation_points.join('; ')}

        AGGREGATED FINDINGS:
        - Total Red Flags: ${fddResponse.aggregated_findings.total_red_flags}
        - Critical Issues: ${fddResponse.aggregated_findings.critical_issues}
        - High Priority Issues: ${fddResponse.aggregated_findings.high_priority_issues}

        CROSS-FUNCTIONAL RISKS:
        ${fddResponse.aggregated_findings.cross_functional_risks.map(r =>
          `- ${r.risk_type} (${r.severity}): ${r.description}. Affected: ${r.affected_areas.join(', ')}. Action: ${r.recommended_action}`
        ).join('\n        ')}

        NEXT STEPS:
        ${fddResponse.next_steps.join('; ')}

        Please generate a complete FDD report with EBITDA bridge analysis, QoE adjustments, NWC analysis, red flags summary, and SPA negotiation points.`
        : `Generate FDD report for ${engagementData.companyName}. Reported EBITDA $5.0M, adjustments: CEO salary add-back $200k, legal settlement $50k, personal expenses $14k. Red flags: AR aging, payables stretching.`

      const result = await callAIAgent(reportInput, AGENT_IDS.REPORT_GENERATION)

      if (result.success && result.response.status === 'success') {
        setReportResponse(result.response.result as ReportResult)
        setCurrentScreen('report')
      }
    } catch (error) {
      console.error('Error generating report:', error)
    } finally {
      setLoading(false)
    }
  }

  // Dashboard Screen
  const DashboardScreen = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">FDD Engagements</h1>
          <p className="text-gray-600 mt-1">Private Equity Financial Due Diligence Platform</p>
        </div>
        <Button onClick={() => setCurrentScreen('setup')} className="bg-blue-900 hover:bg-blue-800">
          <Plus className="w-4 h-4 mr-2" />
          New Engagement
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Active Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">12</div>
            <p className="text-xs text-green-600 mt-1">+2 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Closing This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">3</div>
            <p className="text-xs text-amber-600 mt-1">2 high priority</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Flags Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">9</div>
            <p className="text-xs text-red-600 mt-1">3 critical</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Deal Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">$142M</div>
            <p className="text-xs text-gray-600 mt-1">Across all deals</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Input placeholder="Search engagements..." className="w-full" />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {mockDeals.map(deal => (
          <Card key={deal.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg text-gray-900">{deal.company}</CardTitle>
                  <CardDescription>{deal.industry}</CardDescription>
                </div>
                <Badge className={deal.flags > 2 ? 'bg-red-500' : 'bg-amber-500'}>
                  {deal.flags} {deal.flags === 1 ? 'Flag' : 'Flags'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-600 mb-1">Phase</div>
                  <div className="font-medium text-gray-900">{deal.phase}</div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">Days Remaining</div>
                  <div className="font-medium text-gray-900 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {deal.daysRemaining}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 mb-1">EBITDA</div>
                  <div className="font-medium text-gray-900">${deal.ebitda}M</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  // Engagement Setup Screen
  const SetupScreen = () => (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">New Engagement Setup</h1>
        <p className="text-gray-600 mt-1">Configure deal parameters and team assignments</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input
                placeholder="ABC Manufacturing Inc."
                value={engagementData.companyName}
                onChange={(e) => setEngagementData(prev => ({ ...prev, companyName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Industry</Label>
              <Select value={engagementData.industry} onValueChange={(val) => setEngagementData(prev => ({ ...prev, industry: val }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="saas">SaaS</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Expected Close Date</Label>
              <Input
                type="date"
                value={engagementData.closeDate}
                onChange={(e) => setEngagementData(prev => ({ ...prev, closeDate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Deal Value (MM)</Label>
              <Input
                type="number"
                placeholder="50"
                value={engagementData.dealValue}
                onChange={(e) => setEngagementData(prev => ({ ...prev, dealValue: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Assignment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Team Lead</Label>
              <Select value={engagementData.teamLead} onValueChange={(val) => setEngagementData(prev => ({ ...prev, teamLead: val }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team lead" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="john">John Smith</SelectItem>
                  <SelectItem value="sarah">Sarah Johnson</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Analyst</Label>
              <Select value={engagementData.analyst} onValueChange={(val) => setEngagementData(prev => ({ ...prev, analyst: val }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select analyst" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mike">Mike Davis</SelectItem>
                  <SelectItem value="emily">Emily Chen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setCurrentScreen('dashboard')}>
          Cancel
        </Button>
        <Button
          className="bg-blue-900 hover:bg-blue-800"
          onClick={() => setCurrentScreen('dataroom')}
          disabled={!engagementData.companyName}
        >
          Continue to Data Room
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )

  // Data Room Screen
  const DataRoomScreen = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Data Room Processing</h1>
        <p className="text-gray-600 mt-1">{engagementData.companyName || 'New Engagement'}</p>
      </div>

      <Tabs defaultValue="vdr">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="vdr">VDR Integration</TabsTrigger>
          <TabsTrigger value="manual">Manual Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="vdr" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Virtual Data Room Connection</CardTitle>
              <CardDescription>Connect to your VDR provider</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>VDR Provider</Label>
                <Select value={vdrProvider} onValueChange={setVdrProvider}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="intralinks">Intralinks</SelectItem>
                    <SelectItem value="datasite">Datasite</SelectItem>
                    <SelectItem value="firmex">Firmex</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Credentials</Label>
                <Input type="text" placeholder="Username" className="mb-2" />
                <Input type="password" placeholder="Password" />
              </div>
              <Button className="w-full bg-blue-900 hover:bg-blue-800">
                Connect to VDR
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Upload</CardTitle>
              <CardDescription>Upload financial documents for analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-2">Drag and drop files here or click to browse</p>
                <p className="text-xs text-gray-500">Supported: PDF, Excel (Max 50MB per file)</p>
                <Input
                  type="file"
                  multiple
                  className="mt-4"
                  onChange={(e) => {
                    if (e.target.files) {
                      setUploadedFiles(Array.from(e.target.files))
                    }
                  }}
                />
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label>Uploaded Files ({uploadedFiles.length})</Label>
                  <div className="space-y-1">
                    {uploadedFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-900">{file.name}</span>
                        </div>
                        <Badge variant="outline">Ready</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <h4 className="font-medium text-blue-900 mb-2">Required Documents</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Trial Balance (FY2024)</li>
                  <li>• Audited Financial Statements</li>
                  <li>• Payroll Registers</li>
                  <li>• Inventory Aging Reports</li>
                  <li>• Sales Detail & AR Aging</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {processingStatus === 'processing' && (
        <Card>
          <CardContent className="py-6">
            <div className="text-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-900" />
              <div>
                <h3 className="font-medium text-gray-900">Processing Data Room</h3>
                <p className="text-sm text-gray-600">Analyzing documents and extracting financial data...</p>
              </div>
              <Progress value={65} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setCurrentScreen('setup')}>
          Back
        </Button>
        <Button
          className="bg-blue-900 hover:bg-blue-800"
          onClick={handleProcessDataRoom}
          disabled={loading || uploadedFiles.length === 0}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Process Data Room
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  )

  // Findings Dashboard Screen
  const FindingsScreen = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">FDD Findings</h1>
          <p className="text-gray-600 mt-1">{engagementData.companyName}</p>
        </div>
        <Button
          className="bg-blue-900 hover:bg-blue-800"
          onClick={handleGenerateInterviewPrep}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              Generate Interview Prep
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>

      {fddResponse && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Workflow Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className={fddResponse.workflow_status === 'complete' ? 'bg-green-500' : 'bg-amber-500'}>
                  {fddResponse.workflow_status.toUpperCase()}
                </Badge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total Red Flags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">{fddResponse.aggregated_findings.total_red_flags}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Critical Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">{fddResponse.aggregated_findings.critical_issues}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Risk Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className={getSeverityColor(fddResponse.executive_summary.overall_risk_rating || 'medium')}>
                  {(fddResponse.executive_summary.overall_risk_rating || 'MEDIUM').toUpperCase()}
                </Badge>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Cross-Functional Risks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fddResponse.aggregated_findings.cross_functional_risks.map((risk, idx) => (
                  <div key={idx} className="border-l-4 border-red-500 pl-4 py-2">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{risk.risk_type}</h4>
                      <Badge className={getSeverityColor(risk.severity)}>{risk.severity}</Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{risk.description}</p>
                    <div className="text-xs text-gray-600 mb-2">
                      <span className="font-medium">Affected Areas:</span> {risk.affected_areas.join(', ')}
                    </div>
                    <div className="bg-blue-50 p-3 rounded text-sm">
                      <span className="font-medium text-blue-900">Recommended Action:</span>
                      <p className="text-blue-800 mt-1">{risk.recommended_action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Findings</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {fddResponse.executive_summary.key_findings.map((finding, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Flag className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{finding}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Deal Breakers</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {fddResponse.executive_summary.deal_breakers.map((breaker, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{breaker}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Negotiation Points</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {fddResponse.executive_summary.negotiation_points.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {fddResponse.next_steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <ArrowRight className="w-4 h-4 text-blue-900 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )

  // Interview Prep Screen
  const InterviewScreen = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Management Interview Preparation</h1>
          <p className="text-gray-600 mt-1">{engagementData.companyName}</p>
        </div>
        <Button className="bg-blue-900 hover:bg-blue-800">
          <Download className="w-4 h-4 mr-2" />
          Export Questions
        </Button>
      </div>

      {interviewResponse && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{interviewResponse.interview_prep_summary.total_questions_generated}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Focus Areas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{interviewResponse.interview_prep_summary.focus_areas.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Duration Estimate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-gray-900">{interviewResponse.interview_duration_estimate}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Attendees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{interviewResponse.recommended_attendees.length}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Priority Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {interviewResponse.interview_prep_summary.priority_topics.map((topic, idx) => (
                  <Badge key={idx} variant="outline" className="px-3 py-1">{topic}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {interviewResponse.question_sets.map((questionSet, setIdx) => (
              <Card key={setIdx}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{questionSet.category}</CardTitle>
                      <CardDescription className="mt-1">Related: {questionSet.related_anomaly}</CardDescription>
                    </div>
                    <Badge className={getSeverityColor(questionSet.severity)}>{questionSet.severity}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {questionSet.questions.map((q, qIdx) => (
                    <div key={qIdx} className="border rounded-lg p-4 space-y-3">
                      <div className="font-medium text-gray-900">{q.question}</div>

                      <div className="text-sm space-y-2">
                        <div>
                          <span className="font-medium text-gray-700">Rationale:</span>
                          <p className="text-gray-600 mt-1">{q.rationale}</p>
                        </div>

                        <div>
                          <span className="font-medium text-gray-700">Validation Framework:</span>
                          <p className="text-gray-600 mt-1">{q.validation_framework}</p>
                        </div>

                        <div>
                          <span className="font-medium text-gray-700">Data Requests:</span>
                          <ul className="mt-1 space-y-1">
                            {q.data_requests.map((req, rIdx) => (
                              <li key={rIdx} className="text-gray-600 ml-4">• {req}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <span className="font-medium text-gray-700">Follow-up Questions:</span>
                          <ul className="mt-1 space-y-1">
                            {q.follow_up_questions.map((fq, fIdx) => (
                              <li key={fIdx} className="text-gray-600 ml-4">• {fq}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-2">
                          <Label className="text-xs">Response Notes:</Label>
                          <Textarea
                            placeholder="Add notes from management response..."
                            className="mt-1 text-sm"
                            value={interviewNotes[`${setIdx}-${qIdx}`] || ''}
                            onChange={(e) => {
                              const val = e.target.value
                              setInterviewNotes(prev => ({ ...prev, [`${setIdx}-${qIdx}`]: val }))
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Validation Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {interviewResponse.validation_checklist.map((item, idx) => (
                  <div key={idx} className="border-l-4 border-blue-900 pl-4 py-2">
                    <h4 className="font-semibold text-gray-900 mb-2">{item.claim_to_verify}</h4>
                    <div className="text-sm space-y-2">
                      <div>
                        <span className="font-medium text-gray-700">Required Documentation:</span>
                        <ul className="mt-1 space-y-1">
                          {item.required_documentation.map((doc, dIdx) => (
                            <li key={dIdx} className="text-gray-600 ml-4">• {doc}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Acceptance Criteria:</span>
                        <p className="text-gray-600 mt-1">{item.acceptance_criteria}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setCurrentScreen('findings')}>
              Back to Findings
            </Button>
            <Button
              className="bg-blue-900 hover:bg-blue-800"
              onClick={handleGenerateReport}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  Generate Report
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  )

  // Report Generation Screen
  const ReportScreen = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">FDD Report</h1>
          <p className="text-gray-600 mt-1">{reportResponse?.report_metadata.company_name || engagementData.companyName}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Word
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {reportResponse && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">Executive Summary</CardTitle>
                  <CardDescription className="mt-1">
                    Report ID: {reportResponse.report_metadata.report_id} | Date: {reportResponse.report_metadata.report_date}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <Badge className={getSeverityColor(reportResponse.executive_summary.overall_risk_rating)}>
                    {reportResponse.executive_summary.overall_risk_rating} RISK
                  </Badge>
                  <div className="text-sm text-gray-600 mt-1">{reportResponse.executive_summary.investment_recommendation}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Key Highlights</h4>
                <ul className="space-y-1">
                  {reportResponse.executive_summary.key_highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold text-red-600 mb-2">Critical Issues</h4>
                <ul className="space-y-1">
                  {reportResponse.executive_summary.critical_issues.map((issue, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Value Drivers</h4>
                <ul className="space-y-1">
                  {reportResponse.executive_summary.value_drivers.map((driver, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{driver}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>EBITDA Bridge Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Reported EBITDA</div>
                    <div className="text-2xl font-bold text-gray-900">{formatCurrency(reportResponse.ebitda_bridge.reported_ebitda)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Total Adjustments</div>
                    <div className="text-2xl font-bold text-green-600">
                      +{formatCurrency(reportResponse.ebitda_bridge.adjustments.reduce((sum, adj) => sum + adj.amount, 0))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Normalized EBITDA</div>
                    <div className="text-2xl font-bold text-blue-900">{formatCurrency(reportResponse.ebitda_bridge.normalized_ebitda)}</div>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Adjustment Category</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Defensibility</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportResponse.ebitda_bridge.adjustments.map((adj, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{adj.category}</TableCell>
                        <TableCell className="text-right">{formatCurrency(adj.amount)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={adj.defensibility === 'High' ? 'border-green-500 text-green-700' : 'border-amber-500 text-amber-700'}>
                            {adj.defensibility}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="bg-blue-50 p-4 rounded">
                  <div className="text-sm font-medium text-blue-900 mb-1">Multiple Impact</div>
                  <div className="text-lg font-bold text-blue-900">{formatCurrency(reportResponse.ebitda_bridge.ebitda_multiple_impact)}</div>
                  <div className="text-xs text-blue-700 mt-1">Estimated value impact at 10x multiple</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>QoE Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Add-backs</span>
                  <span className="font-bold text-gray-900">{formatCurrency(reportResponse.qoe_summary.total_addbacks)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Quality Assessment</span>
                  <Badge variant="outline">{reportResponse.qoe_summary.quality_assessment}</Badge>
                </div>
                <Separator />
                <div className="space-y-2">
                  {reportResponse.qoe_summary.addback_categories.map((cat, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-700">{cat.category}</span>
                      <span className="font-medium text-gray-900">{formatCurrency(cat.amount)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>NWC Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Current NWC</span>
                  <span className="font-bold text-gray-900">{formatCurrency(reportResponse.nwc_summary.current_nwc)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Recommended Target</span>
                  <span className="font-bold text-gray-900">{formatCurrency(reportResponse.nwc_summary.recommended_target)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Adjustment Impact</span>
                  <span className="font-bold text-red-600">{formatCurrency(reportResponse.nwc_summary.adjustment_impact)}</span>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">Manipulation Flags:</div>
                  {reportResponse.nwc_summary.manipulation_flags.map((flag, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <Flag className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{flag}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Red Flags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reportResponse.red_flags.critical.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-red-500">CRITICAL</Badge>
                  </div>
                  <ul className="space-y-1">
                    {reportResponse.red_flags.critical.map((flag, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{flag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {reportResponse.red_flags.high.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-amber-500">HIGH</Badge>
                  </div>
                  <ul className="space-y-1">
                    {reportResponse.red_flags.high.map((flag, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{flag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {reportResponse.red_flags.medium.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-yellow-500">MEDIUM</Badge>
                  </div>
                  <ul className="space-y-1">
                    {reportResponse.red_flags.medium.map((flag, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Flag className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{flag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SPA Negotiation Points</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Topic</TableHead>
                    <TableHead>Recommendation</TableHead>
                    <TableHead className="text-right">Financial Impact</TableHead>
                    <TableHead>Priority</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportResponse.spa_negotiation_points.map((point, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{point.topic}</TableCell>
                      <TableCell className="text-sm text-gray-700">{point.recommendation}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(point.financial_impact)}</TableCell>
                      <TableCell>
                        <Badge className={point.priority === 'High' ? 'bg-red-500' : 'bg-amber-500'}>
                          {point.priority}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Price Adjustments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded">
                  <div className="text-sm text-gray-600 mb-1">Valuation Discount</div>
                  <div className="text-xl font-bold text-red-600">
                    -{formatCurrency(reportResponse.price_adjustments.recommended_valuation_discount)}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <div className="text-sm text-gray-600 mb-1">NWC Peg Adjustment</div>
                  <div className="text-xl font-bold text-red-600">
                    -{formatCurrency(reportResponse.price_adjustments.nwc_peg_adjustment)}
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded">
                  <div className="text-sm text-blue-900 mb-1">Total Impact</div>
                  <div className="text-xl font-bold text-blue-900">
                    -{formatCurrency(reportResponse.price_adjustments.total_impact)}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-700 bg-gray-50 p-4 rounded">
                <span className="font-medium">Rationale:</span> {reportResponse.price_adjustments.rationale}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {reportResponse.next_steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <ArrowRight className="w-4 h-4 text-blue-900 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <BarChart className="w-8 h-8" />
                <div>
                  <h1 className="text-xl font-bold">FDD Platform</h1>
                  <p className="text-xs text-blue-200">Private Equity Due Diligence</p>
                </div>
              </div>

              <nav className="flex gap-1">
                <Button
                  variant={currentScreen === 'dashboard' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentScreen('dashboard')}
                  className={currentScreen === 'dashboard' ? '' : 'text-white hover:bg-blue-800'}
                >
                  <HomeIcon className="w-4 h-4 mr-1" />
                  Dashboard
                </Button>
                {engagementData.companyName && (
                  <>
                    <Button
                      variant={currentScreen === 'dataroom' ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => setCurrentScreen('dataroom')}
                      className={currentScreen === 'dataroom' ? '' : 'text-white hover:bg-blue-800'}
                    >
                      Data Room
                    </Button>
                    <Button
                      variant={currentScreen === 'findings' ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => setCurrentScreen('findings')}
                      className={currentScreen === 'findings' ? '' : 'text-white hover:bg-blue-800'}
                      disabled={!fddResponse}
                    >
                      Findings
                    </Button>
                    <Button
                      variant={currentScreen === 'interview' ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => setCurrentScreen('interview')}
                      className={currentScreen === 'interview' ? '' : 'text-white hover:bg-blue-800'}
                      disabled={!interviewResponse}
                    >
                      Interview
                    </Button>
                    <Button
                      variant={currentScreen === 'report' ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => setCurrentScreen('report')}
                      className={currentScreen === 'report' ? '' : 'text-white hover:bg-blue-800'}
                      disabled={!reportResponse}
                    >
                      Report
                    </Button>
                  </>
                )}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right text-sm">
                <div className="font-medium">Analyst Portal</div>
                <div className="text-xs text-blue-200">John Smith</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {currentScreen === 'dashboard' && <DashboardScreen />}
        {currentScreen === 'setup' && <SetupScreen />}
        {currentScreen === 'dataroom' && <DataRoomScreen />}
        {currentScreen === 'findings' && <FindingsScreen />}
        {currentScreen === 'interview' && <InterviewScreen />}
        {currentScreen === 'report' && <ReportScreen />}
      </main>
    </div>
  )
}
