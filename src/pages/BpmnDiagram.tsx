import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { useParams } from "react-router-dom";
import { getBpmnDiagramXml, getOrder } from "@/services/orderService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

// We're assuming this component uses BpmnJS which might be imported and used here
// This would need a canvas element with specific ID for rendering the BPMN diagram

const BpmnDiagram = () => {
  const { id } = useParams<{ id: string }>();
  const [diagramXml, setDiagramXml] = useState<string>("");
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiagramAndOrder = async () => {
      if (!id) {
        setError("No order ID provided");
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const [orderData, diagramData] = await Promise.all([
          getOrder(id),
          getBpmnDiagramXml(id)
        ]);
        setOrder(orderData);
        setDiagramXml(diagramData);
      } catch (err) {
        console.error("Error loading BPMN diagram:", err);
        setError("Failed to load process diagram");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiagramAndOrder();
  }, [id]);

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
              Order ID: {order.id}
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Business Process Flow</CardTitle>
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
              <div className="h-96 border rounded-md overflow-auto">
                <div id="bpmnCanvas" className="w-full h-full"></div>
                {/* The actual BPMN rendering would happen here using the diagramXml state */}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default BpmnDiagram;
