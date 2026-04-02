"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle2, XCircle } from "lucide-react";
import { useSidebar } from "@/components/layout/SidebarContext";

interface RCCOReviewData {
  reviewStatus: 'passed' | 'failed' | null;
  comment: string;
}

export function RCCOCheckerSidebar() {
  const { devRole } = useSidebar();
  const [reviewData, setReviewData] = useState<RCCOReviewData>({
    reviewStatus: null,
    comment: '',
  });

  if (devRole !== 'rcco-checker') {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Review and Opinion Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">พิจารณาและให้ความเห็น</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Review Status */}
          <div>
            <Label className="text-base font-semibold mb-3 block">
              สถานะการพิจารณา <span className="text-red-500">*</span>
            </Label>
            <RadioGroup
              value={reviewData.reviewStatus || ''}
              onValueChange={(value) =>
                setReviewData({
                  ...reviewData,
                  reviewStatus: value as 'passed' | 'failed',
                })
              }
            >
              <div className="space-y-3">
                {/* Passed */}
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-green-50 cursor-pointer transition-colors"
                  onClick={() =>
                    setReviewData({
                      ...reviewData,
                      reviewStatus: 'passed',
                    })
                  }
                >
                  <RadioGroupItem value="passed" id="passed" />
                  <Label htmlFor="passed" className="flex items-center gap-2 cursor-pointer flex-1 m-0">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span>ผ่านการตรวจสอบ</span>
                  </Label>
                </div>

                {/* Failed */}
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-red-50 cursor-pointer transition-colors"
                  onClick={() =>
                    setReviewData({
                      ...reviewData,
                      reviewStatus: 'failed',
                    })
                  }
                >
                  <RadioGroupItem value="failed" id="failed" />
                  <Label htmlFor="failed" className="flex items-center gap-2 cursor-pointer flex-1 m-0">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span>ไม่ผ่านการตรวจสอบ</span>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Comment Section */}
          <div>
            <Label htmlFor="comment" className="text-base font-semibold mb-2 block">
              ความคิดเห็นเพิ่มเติม <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="comment"
              placeholder="ระบุความคิดเห็นเพิ่มเติมที่นี่..."
              value={reviewData.comment}
              onChange={(e) =>
                setReviewData({
                  ...reviewData,
                  comment: e.target.value,
                })
              }
              className="min-h-[120px] resize-none"
            />
          </div>

          {/* Reviewed By */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <Label className="text-sm font-semibold text-gray-600">
              พิจารณาโดย
            </Label>
            <div className="text-base font-medium text-gray-900 mt-2">
              {devRole === 'rcco-checker' ? 'RC Checker' : 'Unknown'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
