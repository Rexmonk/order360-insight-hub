
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BpmnJS from 'bpmn-js/dist/bpmn-navigated-viewer.production.min.js';
import { getBpmnDiagramXml, getOrderById } from '@/services/orderService';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';

const BpmnDiagram = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const bpmnViewerRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize BPMN viewer
    if (containerRef.current) {
      bpmnViewerRef.current = new BpmnJS({
        container: containerRef.current,
      });

      // Check if order exists
      const order = id ? getOrderById(id) : null;
      
      if (!order) {
        setError('Order not found');
        setLoading(false);
        return;
      }

      // Get BPMN diagram XML
      const diagramXml = getBpmnDiagramXml();
      
      // Import diagram
      bpmnViewerRef.current
        .importXML(diagramXml)
        .then(() => {
          const canvas = bpmnViewerRef.current.get('canvas');
          canvas.zoom('fit-viewport');
          
          // Highlight the current state in the process
          try {
            const elementRegistry = bpmnViewerRef.current.get('elementRegistry');
            const overlays = bpmnViewerRef.current.get('overlays');
            
            // Map order state to BPMN activity
            let highlightElementId;
            switch (order.state) {
              case 'Created':
                highlightElementId = 'StartEvent_1';
                break;
              case 'Accepted':
                highlightElementId = 'Activity_1';
                break;
              case 'In Progress':
                highlightElementId = 'Activity_2';
                break;
              case 'Completed':
                highlightElementId = 'EndEvent_1';
                break;
              case 'Canceled':
                highlightElementId = 'Activity_3';
                break;
              default:
                highlightElementId = null;
            }
            
            if (highlightElementId) {
              const element = elementRegistry.get(highlightElementId);
              if (element) {
                canvas.addMarker(highlightElementId, 'highlight');
                
                // Add an overlay with current status
                overlays.add(highlightElementId, {
                  position: {
                    top: -10,
                    left: -10
                  },
                  html: `
                    <div class="px-2 py-1 bg-primary text-white text-xs font-medium rounded-sm shadow">
                      Current Status
                    </div>
                  `
                });
              }
            }
          } catch (err) {
            console.error('Error highlighting process state:', err);
          }
          
          setLoading(false);
        })
        .catch((err: Error) => {
          console.error('Error importing BPMN diagram:', err);
          setError('Failed to load process diagram');
          setLoading(false);
          toast.error('Failed to load process diagram');
        });
    }

    // Cleanup
    return () => {
      if (bpmnViewerRef.current) {
        bpmnViewerRef.current.destroy();
      }
    };
  }, [id]);

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(`/order-details/${id}`)}
              aria-label="Back to Order Details"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Process Diagram</h1>
          </div>
          
          {id && (
            <div className="text-sm text-gray-500">
              Order ID: {id}
            </div>
          )}
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          {loading && (
            <div className="flex items-center justify-center h-[500px]">
              <div className="animate-pulse text-center">
                <div className="h-8 bg-gray-200 rounded w-48 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-64 mx-auto mt-2"></div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="flex items-center justify-center h-[500px]">
              <div className="text-center text-red-500">
                <p>{error}</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => navigate(`/order-details/${id}`)}
                >
                  Return to Order Details
                </Button>
              </div>
            </div>
          )}
          
          <div 
            ref={containerRef} 
            className="w-full h-[600px]"
            style={{ 
              display: loading || error ? 'none' : 'block',
              '--highlight-fill-color': '#e20074',
              '--highlight-stroke-color': '#e20074'
            } as React.CSSProperties}
          />
        </div>
      </div>
      
      <style jsx>{`
        :global(.highlight) {
          stroke: var(--highlight-stroke-color) !important;
          stroke-width: 3px !important;
          fill: var(--highlight-fill-color, rgba(226, 0, 116, 0.2)) !important;
        }
      `}</style>
    </Layout>
  );
};

export default BpmnDiagram;
