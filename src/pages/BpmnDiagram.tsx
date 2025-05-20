
import { useState, useEffect, useRef } from "react";
import Layout from "@/components/layout/Layout";
import { useParams } from "react-router-dom";
import { getBpmnDiagramXml, getOrder, getProcessVariables } from "@/services/orderService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ZoomIn, ZoomOut, Move, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BpmnJS from "bpmn-js/dist/bpmn-navigated-viewer.production.min.js";

const BpmnDiagram = () => {
  const { id } = useParams<{ id: string }>();
  const [diagramXml, setDiagramXml] = useState<string>("");
  const [order, setOrder] = useState<any>(null);
  const [processVariables, setProcessVariables] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentZoom, setCurrentZoom] = useState<number>(1);
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

  // Format JSON value for display
  const formatJsonValue = (value: string) => {
    try {
      // If it's a JSON string (with quotes), parse it
      if (value.startsWith('"') && value.endsWith('"')) {
        return value.substring(1, value.length - 1);
      }
      
      // If it's a JSON object, try to parse and format it
      const parsedValue = JSON.parse(value);
      return JSON.stringify(parsedValue, null, 2);
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {processVariables.items.map((variable: any) => (
                  <div
                    key={variable.key}
                    className="p-4 border rounded-md bg-gray-50"
                  >
                    <h3 className="font-medium text-gray-800">{variable.name}</h3>
                    <div className="mt-1">
                      <pre className="bg-white p-2 rounded border text-xs overflow-auto max-h-24">
                        {formatJsonValue(variable.value)}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default BpmnDiagram;
