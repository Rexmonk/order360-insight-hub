
import { useState, useEffect, useRef } from "react";
import Layout from "@/components/layout/Layout";
import { useParams } from "react-router-dom";
import { getBpmnDiagramXml, getOrder, getProcessVariables } from "@/services/orderService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ZoomIn, ZoomOut, Move, RotateCcw, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BpmnJS from "bpmn-js/dist/bpmn-navigated-viewer.production.min.js";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const BpmnDiagram = () => {
  const { id } = useParams<{ id: string }>();
  const [diagramXml, setDiagramXml] = useState<string>("");
  const [order, setOrder] = useState<any>(null);
  const [processVariables, setProcessVariables] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentZoom, setCurrentZoom] = useState<number>(1);
  const [expandedVariables, setExpandedVariables] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  
  // Refs for the BPMN viewer and container
  const bpmnViewerRef = useRef<any>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  
  // Initialize BPMN viewer
  useEffect(() => {
    if (!bpmnViewerRef.current && canvasContainerRef.current) {
      try {
        // Initialize the BPMN viewer
        const viewer = new BpmnJS({
          container: canvasContainerRef.current
        });
        
        bpmnViewerRef.current = viewer;
        
        // Configure keyboard bindings (default ones to handle)
        const keyboard = viewer.get('keyboard');
        keyboard.bind(document);
        
        return () => {
          if (bpmnViewerRef.current) {
            bpmnViewerRef.current.destroy();
            bpmnViewerRef.current = null;
          }
          keyboard.unbind();
        };
      } catch (err) {
        console.error("Failed to initialize BPMN viewer:", err);
        setError("Failed to initialize BPMN viewer. Please try again.");
      }
    }
  }, []);
  
  // Load diagram when XML is available
  useEffect(() => {
    const loadDiagram = async () => {
      if (diagramXml && bpmnViewerRef.current) {
        try {
          await bpmnViewerRef.current.importXML(diagramXml);
          const canvas = bpmnViewerRef.current.get('canvas');
          canvas.zoom('fit-viewport');
          setCurrentZoom(canvas.zoom());
          
          toast.success("Process diagram loaded successfully");
        } catch (err) {
          console.error("Failed to load BPMN diagram:", err);
          setError("Failed to load the process diagram. The XML might be invalid.");
        }
      }
    };
    
    loadDiagram();
  }, [diagramXml]);

  // Fetch diagram XML and order details
  useEffect(() => {
    const fetchDiagramAndOrder = async () => {
      if (!id) {
        setError("No order ID provided");
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const [orderData, diagramData, processVarsData] = await Promise.all([
          getOrder(id),
          getBpmnDiagramXml(id),
          getProcessVariables(id)
        ]);
        
        setOrder(orderData);
        setDiagramXml(diagramData);
        setProcessVariables(processVarsData);
      } catch (err) {
        console.error("Error loading BPMN diagram:", err);
        setError("Failed to load process diagram");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiagramAndOrder();
  }, [id]);

  // Zoom in handler
  const handleZoomIn = () => {
    if (bpmnViewerRef.current) {
      const canvas = bpmnViewerRef.current.get('canvas');
      const newZoom = Math.min(canvas.zoom() * 1.2, 3); // Limit max zoom to 3x
      canvas.zoom(newZoom);
      setCurrentZoom(newZoom);
    }
  };
  
  // Zoom out handler
  const handleZoomOut = () => {
    if (bpmnViewerRef.current) {
      const canvas = bpmnViewerRef.current.get('canvas');
      const newZoom = Math.max(canvas.zoom() / 1.2, 0.3); // Limit min zoom to 0.3x
      canvas.zoom(newZoom);
      setCurrentZoom(newZoom);
    }
  };
  
  // Reset view handler
  const handleResetView = () => {
    if (bpmnViewerRef.current) {
      const canvas = bpmnViewerRef.current.get('canvas');
      canvas.zoom('fit-viewport');
      setCurrentZoom(canvas.zoom());
    }
  };
  
  // Toggle move mode
  const handleMove = () => {
    if (bpmnViewerRef.current) {
      const canvas = bpmnViewerRef.current.get('canvas');
      // Toggle move mode (pan)
      if (!canvas._dragging) {
        toast.info("Pan mode enabled. Click and drag to move the diagram");
      }
    }
  };

  // Toggle variable expansion
  const toggleVariableExpansion = (key: string) => {
    setExpandedVariables(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Format JSON value for display with truncation
  const formatJsonValue = (value: string, isExpanded: boolean) => {
    try {
      // If it's a JSON string (with quotes), parse it
      let formattedValue = value;
      
      if (value.startsWith('"') && value.endsWith('"')) {
        formattedValue = value.substring(1, value.length - 1);
      } else if (value.startsWith('{') || value.startsWith('[')) {
        // If it's a JSON object, try to parse and format it
        const parsedValue = JSON.parse(value);
        formattedValue = JSON.stringify(parsedValue, null, 2);
      }
      
      // Truncate large values if not expanded
      if (!isExpanded && formattedValue.length > 100) {
        return formattedValue.substring(0, 100) + '...';
      }
      
      return formattedValue;
    } catch (e) {
      return value;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(-1)}
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Process Diagram</h1>
          </div>
          
          {order && (
            <div className="text-sm text-gray-500">
              Order: {order.orderNumber}
            </div>
          )}
        </div>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center pb-2">
            <CardTitle>Business Process Flow</CardTitle>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleZoomIn}
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleZoomOut}
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleMove}
                title="Pan Mode"
              >
                <Move className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleResetView}
                title="Reset View"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-96">
                <p>Loading diagram...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200">
                {error}
              </div>
            ) : (
              <div className="h-96 border rounded-md overflow-hidden">
                <div ref={canvasContainerRef} className="w-full h-full"></div>
              </div>
            )}
          </CardContent>
        </Card>

        {processVariables && (
          <Card>
            <CardHeader>
              <CardTitle>Process Variables</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Truncated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processVariables.items.map((variable: any) => (
                    <TableRow key={variable.key}>
                      <TableCell className="font-medium">{variable.name}</TableCell>
                      <TableCell>{variable.key}</TableCell>
                      <TableCell className="max-w-md">
                        <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto max-h-60">
                          {formatJsonValue(variable.value, !!expandedVariables[variable.key])}
                        </pre>
                      </TableCell>
                      <TableCell>{variable.truncated ? 'Yes' : 'No'}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleVariableExpansion(variable.key)}
                          title={expandedVariables[variable.key] ? "Collapse value" : "Expand value"}
                        >
                          {expandedVariables[variable.key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default BpmnDiagram;
